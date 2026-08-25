import { useEffect, useRef, useState, type FormEvent, type ComponentProps } from 'react'
import { Bot, Send, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { cn } from '@/lib/cn'
import { getMessageText } from '@/features/ai/utils/messageText'
import { useGroceryChat } from '@/features/ai/hooks/useGroceryChat'

const SUGGESTIONS = ['Best deals?', 'Breakfast ideas', 'Under £10'] as const

const PREVIEW_USER = 'What are your best deals right now?'
const PREVIEW_ASSISTANT =
  '**3 hot picks today:**\n\n- 🍓 Berry Medley — £14.99 ★4.8\n- 🍗 Chicken Breast — £19.54\n- 🥛 Yogurt Parfait — £6.99\n\nAll in stock — tap **Add** on any card →'

/** Renders markdown inside an AI bubble with nice typography */
function MdBubble({ children, className }: { children: string; className?: string }) {
  const components: ComponentProps<typeof ReactMarkdown>['components'] = {
    p: ({ children: c }) => <p className="mb-2 last:mb-0">{c}</p>,
    strong: ({ children: c }) => <strong className="font-bold text-grocery-900">{c}</strong>,
    em: ({ children: c }) => <em className="italic text-grocery-500">{c}</em>,
    h1: ({ children: c }) => <p className="mb-1 font-extrabold text-grocery-900">{c}</p>,
    h2: ({ children: c }) => <p className="mb-1 font-bold text-grocery-900">{c}</p>,
    h3: ({ children: c }) => <p className="mb-1 font-semibold text-grocery-800">{c}</p>,
    ul: ({ children: c }) => <ul className="mb-2 space-y-1 pl-1 last:mb-0">{c}</ul>,
    ol: ({ children: c }) => <ol className="mb-2 space-y-1 pl-1 last:mb-0">{c}</ol>,
    li: ({ children: c }) => (
      <li className="flex gap-1.5">
        <span className="mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" aria-hidden />
        <span>{c}</span>
      </li>
    ),
    code: ({ children: c }) => (
      <code className="rounded bg-grocery-100 px-1 py-0.5 text-[11px] font-mono text-grocery-700">
        {c}
      </code>
    ),
  }

  return (
    <div className={cn('text-xs leading-relaxed text-grocery-900', className)}>
      <ReactMarkdown components={components}>{children}</ReactMarkdown>
    </div>
  )
}

export function ChatPanel() {
  const { messages, sendMessage, status, error, stop } = useGroceryChat()
  const [input, setInput] = useState('')
  const scrollRef = useRef<HTMLDivElement>(null)
  const showPreview = messages.length === 0
  const busy = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, busy])

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const text = input.trim()
    if (!text || busy) return
    sendMessage({ text })
    setInput('')
  }

  function sendSuggestion(text: string) {
    if (busy) return
    sendMessage({ text })
  }

  return (
    <section
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl bg-white shadow-lg ring-1 ring-white/20"
      aria-label="AI shopping chat"
    >
      <header className="relative flex shrink-0 items-center gap-2 overflow-hidden bg-gradient-to-r from-grocery-900 via-grocery-800 to-teal-900 px-3 py-2 text-white">
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-400 text-grocery-950">
          <Bot className="h-4 w-4" strokeWidth={2.5} aria-hidden />
        </div>
        <div className="relative min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <h2 className="text-xs font-bold">Grocery+ Assistant</h2>
            <Sparkles className="h-3 w-3 text-amber-300" aria-hidden />
          </div>
          <p className="truncate text-[10px] text-white/70">Live catalog · instant answers</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-400/25 px-2 py-0.5 text-[10px] font-bold text-emerald-100">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Live
        </span>
      </header>

      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto bg-gradient-to-b from-grocery-50/80 to-white px-3 py-3"
        aria-live="polite"
      >
        {/* Preview bubbles */}
        {showPreview && (
          <div className="space-y-2.5">
            <div className="flex justify-end">
              <div className="max-w-[88%] rounded-2xl rounded-br-sm bg-grocery-900 px-3 py-2 text-xs leading-snug text-white">
                {PREVIEW_USER}
              </div>
            </div>
            <div className="flex justify-start gap-1.5">
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-emerald-400 to-cyan-400 text-grocery-950">
                <Bot className="h-3.5 w-3.5" aria-hidden />
              </div>
              <div className="max-w-[90%] rounded-2xl rounded-bl-sm border border-emerald-100 bg-white px-3.5 py-2.5 shadow-sm">
                <MdBubble>{PREVIEW_ASSISTANT}</MdBubble>
              </div>
            </div>
          </div>
        )}

        {/* Real messages */}
        <div className={cn('space-y-2.5', showPreview && messages.length > 0 && 'mt-3')}>
          {messages.map((message) => {
            const isUser = message.role === 'user'
            const text = getMessageText(message)
            if (!text) return null

            return (
              <div
                key={message.id}
                className={cn('flex', isUser ? 'justify-end' : 'justify-start gap-1.5')}
              >
                {!isUser && (
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-emerald-400 to-cyan-400 text-grocery-950">
                    <Bot className="h-3.5 w-3.5" aria-hidden />
                  </div>
                )}
                {isUser ? (
                  <div className="max-w-[90%] rounded-2xl rounded-br-sm bg-grocery-900 px-3 py-2 text-xs leading-snug text-white">
                    {text}
                  </div>
                ) : (
                  <div className="max-w-[90%] rounded-2xl rounded-bl-sm border border-grocery-100 bg-white px-3.5 py-2.5 shadow-sm">
                    <MdBubble>{text}</MdBubble>
                  </div>
                )}
              </div>
            )
          })}

          {busy && (
            <div className="flex justify-start gap-1.5">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-emerald-400 to-cyan-400">
                <Bot className="h-3.5 w-3.5 animate-pulse text-grocery-950" />
              </div>
              <div className="flex items-center gap-1.5 rounded-2xl border border-grocery-100 bg-white px-3 py-2 shadow-sm">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-emerald-400"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {error && (
            <p className="rounded-lg bg-red-50 px-2 py-1.5 text-[11px] text-red-600" role="alert">
              {error.message}
            </p>
          )}
        </div>
      </div>

      <div className="shrink-0 border-t border-grocery-100 bg-white px-2 py-1.5">
        <div className="mb-1.5 flex gap-1 overflow-x-auto [scrollbar-width:none]">
          {SUGGESTIONS.map((text) => (
            <button
              key={text}
              type="button"
              onClick={() => sendSuggestion(text)}
              disabled={busy}
              className="shrink-0 rounded-full border border-grocery-200 px-2.5 py-0.5 text-[10px] font-semibold text-grocery-800 transition hover:border-emerald-300 hover:bg-emerald-50 disabled:opacity-50"
            >
              {text}
            </button>
          ))}
        </div>
        <form onSubmit={onSubmit} className="flex gap-1.5">
          <label className="sr-only" htmlFor="grocery-chat-input">
            Message
          </label>
          <input
            id="grocery-chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={status !== 'ready'}
            placeholder="Ask about any product…"
            className="min-w-0 flex-1 rounded-lg border border-grocery-200 bg-grocery-50 px-3 py-2 text-xs text-grocery-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-200"
            autoComplete="off"
          />
          {busy ? (
            <button
              type="button"
              onClick={() => stop()}
              className="shrink-0 rounded-lg border px-3 py-2 text-[10px] font-semibold"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              disabled={status !== 'ready' || !input.trim()}
              className="flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-cyan-500 px-3 py-2 text-white shadow-md disabled:opacity-40"
              aria-label="Send"
            >
              <Send className="h-3.5 w-3.5" aria-hidden />
            </button>
          )}
        </form>
      </div>
    </section>
  )
}
