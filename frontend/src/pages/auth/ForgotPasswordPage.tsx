import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { EnvelopeIcon } from '@/components/ui/FormIcons'
import { TextField } from '@/components/ui/TextField'
import { Button } from '@/components/ui/Button'
import { paths } from '@/constants/paths'
import { requestForgotPassword } from '@/lib/api/authApi'
import { ApiError } from '@/lib/api/apiError'
import { toastApiError } from '@/lib/api/toastApiError'
import { forgotPasswordFormSchema } from '@/lib/validation/authSchemas'
import { toastFirstZodIssue } from '@/lib/validation/toastZodError'

export function ForgotPasswordPage() {
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const identifier = String(
      new FormData(e.currentTarget).get('identifier') ?? '',
    ).trim()

    const parsed = forgotPasswordFormSchema.safeParse({ identifier })
    if (!parsed.success) {
      toastFirstZodIssue(parsed.error)
      return
    }

    setBusy(true)
    try {
      await requestForgotPassword({ identifier: parsed.data.identifier })
      toast.success('If an account exists, we sent a code to your email or phone.')
      navigate(paths.verifyOtp, { state: { identifier }, replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        toastApiError(err, 'Could not send code')
      } else {
        toast.error('Something went wrong. Check your network and try again.')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-grocery-50/40 flex min-h-svh w-full">
      <aside
        className="relative min-h-56 w-full overflow-hidden bg-[#2a7cb0] md:min-h-full md:w-[50%] md:max-w-md"
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: 'rgba(0,0,0,0.1)',
            backgroundImage: "url('/patterns/veg-line-tile.svg')",
            backgroundSize: '120px 120px',
            backgroundRepeat: 'repeat',
          }}
        />
        <div className="from-grocery-900/5 absolute inset-0 bg-gradient-to-b to-black/0" />
        <div className="relative z-10 flex h-full min-h-56 items-center justify-center p-8 md:min-h-0" />
      </aside>
      <main className="flex w-full flex-1 flex-col gap-4 px-6 py-6">
        <div className="text-grocery-900 mt-10 text-center">
          <h1 className="mb-3 text-xl font-semibold">Forgot password</h1>
          <p className="text-grocery-500 mt-1 text-sm">
            Enter your email or phone number. We’ll send a verification code.
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-3">
          <TextField
            name="identifier"
            type="email"
            inputMode="email"
            autoComplete="username"
            required
            label="Email or phone"
            startAdornment={<EnvelopeIcon />}
          />
          <Button type="submit" loading={busy}>
            Send code
          </Button>
          <p className="text-grocery-500 text-center text-sm">
            <Link
              to={paths.login}
              className="text-grocery-900 font-medium underline"
            >
              Back to login
            </Link>
          </p>
        </form>
      </main>
    </div>
  )
}
