import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { OtpInputSix } from '@/components/ui/OtpInputSix'
import { Button } from '@/components/ui/Button'
import { paths } from '@/constants/paths'
import { verifyPasswordOtp } from '@/lib/api/authApi'
import { ApiError } from '@/lib/api/apiError'
import { toastApiError } from '@/lib/api/toastApiError'
import { verifyOtpFormSchema } from '@/lib/validation/authSchemas'
import { toastFirstZodIssue } from '@/lib/validation/toastZodError'

type OtpLocationState = {
  identifier?: string
}

const emptyDigits = () => Array.from({ length: 6 }, () => '')

export function VerifyOtpPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [busy, setBusy] = useState(false)
  const [otpDigits, setOtpDigits] = useState(emptyDigits)

  const fromState = (location.state as OtpLocationState | null)?.identifier
  const fromQuery = searchParams.get('identifier')?.trim() ?? ''
  const identifier = (fromState ?? fromQuery) || ''

  useEffect(() => {
    if (!identifier) {
      navigate(paths.forgotPassword, { replace: true })
    }
  }, [identifier, navigate])

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!identifier) {
      return
    }
    const otp = otpDigits.join('').replace(/\D/g, '')
    const parsed = verifyOtpFormSchema.safeParse({ identifier, otp })
    if (!parsed.success) {
      toastFirstZodIssue(parsed.error)
      return
    }

    setBusy(true)
    try {
      await verifyPasswordOtp({
        identifier: parsed.data.identifier,
        otp: parsed.data.otp,
      })
      toast.success('Code verified. Now choose a new password.')
      navigate(paths.resetPassword, { state: { identifier, otp }, replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        toastApiError(err, 'Verification failed')
      } else {
        toast.error('Something went wrong. Check your network and try again.')
      }
    } finally {
      setBusy(false)
    }
  }

  if (!identifier) {
    return null
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
          <h1 className="mb-3 text-xl font-semibold">Enter verification code</h1>
          <p className="text-grocery-500 mt-1 text-sm">
            Code sent to{' '}
            <span className="text-grocery-800 font-medium break-all">
              {identifier}
            </span>
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p className="text-grocery-600 text-center text-sm">6-digit code</p>
            <OtpInputSix
              value={otpDigits}
              onChange={setOtpDigits}
              disabled={busy}
            />
          </div>
          <Button type="submit" loading={busy}>
            Verify
          </Button>
          <p className="text-grocery-500 text-center text-sm">
            <Link
              to={paths.forgotPassword}
              className="text-grocery-900 font-medium underline"
            >
              Resend code
            </Link>
            {' · '}
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
