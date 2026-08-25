import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { aiChatDevPlugin } from './vite-plugins/aiChatDevPlugin'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const useAiChatDev = mode === 'development' && env.VITE_AI_MOCK !== 'false'
  const apiProxyTarget =
    env.VITE_API_PROXY_TARGET?.trim() ||
    env.VITE_API_BASE_URL?.trim() ||
    'https://grocery.newcinderella.online'
  const catalogApiBase =
    env.AI_CATALOG_API_BASE?.trim() ||
    env.VITE_API_BASE_URL?.trim() ||
    'https://grocery.newcinderella.online'

  // So @ai-sdk/anthropic and the dev plugin can read the key from process.env
  if (env.ANTHROPIC_API_KEY) {
    process.env.ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY
  }
  if (env.CLAUDE_MODEL) {
    process.env.CLAUDE_MODEL = env.CLAUDE_MODEL
  }

  return {
  plugins: [
    react(),
    tailwindcss(),
    aiChatDevPlugin({
      enabled: useAiChatDev,
      anthropicApiKey: env.ANTHROPIC_API_KEY,
      model: env.CLAUDE_MODEL || 'claude-haiku-4-5',
      catalogApiBase,
    }),
  ],
  server: {
    proxy: {
      // Dev requests to `/api` are proxied so the browser stays same-origin.
      // Point `VITE_API_PROXY_TARGET` at `backend/` (e.g. http://127.0.0.1:8000)
      // to develop against the local Laravel instead of the hosted API.
      '/api': {
        target: apiProxyTarget,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  }
})
