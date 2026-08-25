import type { IncomingMessage, ServerResponse } from 'node:http'
import type { Plugin } from 'vite'
import { createAnthropic } from '@ai-sdk/anthropic'
import { loadEnv } from 'vite'
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  streamText,
  type UIMessage,
} from 'ai'
import {
  buildCatalogMockReply,
  buildGroceryCatalogContext,
  buildGroceryCatalogSystemPrompt,
} from './groceryCatalogContext'

export type AiChatDevPluginOptions = {
  enabled: boolean
  anthropicApiKey?: string
  model: string
  /** Grocery API used to load product catalog (Node fetch — not the Vite proxy). */
  catalogApiBase: string
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on('data', (chunk: Buffer) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

function resolveAnthropicApiKey(
  options: AiChatDevPluginOptions,
  mode: string,
  envDir: string,
): string {
  const loaded = loadEnv(mode, envDir, '')
  return (
    options.anthropicApiKey?.trim() ||
    loaded.ANTHROPIC_API_KEY?.trim() ||
    process.env.ANTHROPIC_API_KEY?.trim() ||
    ''
  )
}

async function handleMock(
  userText: string,
  products: Awaited<ReturnType<typeof buildGroceryCatalogContext>>,
  res: ServerResponse,
) {
  const reply = buildCatalogMockReply(userText, products)

  const stream = createUIMessageStream({
    execute: async ({ writer }) => {
      const id = 'assistant-text'
      writer.write({ type: 'text-start', id })
      for (const word of reply.split(' ')) {
        await new Promise((r) => setTimeout(r, 28))
        writer.write({ type: 'text-delta', id, delta: `${word} ` })
      }
      writer.write({ type: 'text-end', id })
    },
  })

  const response = createUIMessageStreamResponse({ stream })
  await pipeResponse(response, res)
}

async function handleAnthropic(
  apiKey: string,
  modelId: string,
  system: string,
  messages: UIMessage[],
  res: ServerResponse,
) {
  const provider = createAnthropic({ apiKey })
  const result = streamText({
    model: provider(modelId),
    system,
    messages: await convertToModelMessages(messages),
  })

  const response = result.toUIMessageStreamResponse()
  await pipeResponse(response, res)
}

async function pipeResponse(response: Response, res: ServerResponse) {
  res.statusCode = response.status
  response.headers.forEach((value, key) => {
    res.setHeader(key, value)
  })
  if (!response.body) {
    res.end()
    return
  }
  const reader = response.body.getReader()
  for (;;) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    res.write(Buffer.from(value))
  }
  res.end()
}

function lastUserText(messages: UIMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i]
    if (m?.role !== 'user') {
      continue
    }
    const part = m.parts?.find((p) => p.type === 'text')
    if (part && 'text' in part && typeof part.text === 'string') {
      return part.text.trim()
    }
  }
  return ''
}

/**
 * Dev-only POST /api/ai/chat — Anthropic + live Grocery+ product catalog.
 */
export function aiChatDevPlugin(options: AiChatDevPluginOptions): Plugin {
  return {
    name: 'grocery-ai-chat-dev',
    configureServer(server) {
      if (!options.enabled) {
        return
      }

      const envDir = server.config.envDir || process.cwd()
      const mode = server.config.mode

      server.middlewares.use((req, res, next) => {
        const urlPath = req.url?.split('?')[0]
        if (urlPath !== '/api/ai/chat' || req.method !== 'POST') {
          next()
          return
        }

        void (async () => {
          try {
            const raw = await readBody(req)
            const body = raw ? (JSON.parse(raw) as { messages?: UIMessage[] }) : {}
            const messages = Array.isArray(body.messages) ? body.messages : []
            const userText = lastUserText(messages)
            const apiKey = resolveAnthropicApiKey(options, mode, envDir)

            const products = await buildGroceryCatalogContext(
              options.catalogApiBase,
              userText,
            )
            const system = buildGroceryCatalogSystemPrompt(products)

            if (apiKey) {
              await handleAnthropic(apiKey, options.model, system, messages, res)
              return
            }

            await handleMock(userText, products, res)
          } catch (err) {
            const message = err instanceof Error ? err.message : 'Chat failed'
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: message }))
          }
        })()
      })
    },
  }
}
