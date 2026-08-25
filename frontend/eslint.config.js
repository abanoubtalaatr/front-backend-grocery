import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),

  // ─── Base rules (all TS/TSX files) ────────────────────────────────────────
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },

  // ─── Rule 1: pages/routes must only import from a feature's barrel ─────────
  // ❌ import { useManageAddress } from '@/features/addresses/hooks/useManageAddress'
  // ✅ import { useManageAddress } from '@/features/addresses'
  {
    files: ['src/pages/**/*.{ts,tsx}', 'src/routes/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*/**'],
              message:
                "Do not import from inside a feature. Use the barrel instead: e.g. '@/features/addresses'.",
            },
          ],
        },
      ],
    },
  },

  // ─── Rule 2: pages must not contain data-fetching or form logic ────────────
  // ❌ useQuery / useMutation / useForm / z.object inside src/pages/
  // ✅ put that logic in src/features/<name>/hooks/ or src/features/<name>/schema.ts
  {
    files: ['src/pages/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "CallExpression[callee.name=/^(useQuery|useMutation|useQueryClient|useForm)$/]",
          message:
            "Data-fetching and form logic must live in 'src/features/<name>/hooks/', not in src/pages/.",
        },
      ],
    },
  },
])
