/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  /** Set to `false` to skip dev mock and proxy /api/ai/chat to the backend. */
  readonly VITE_AI_MOCK?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
