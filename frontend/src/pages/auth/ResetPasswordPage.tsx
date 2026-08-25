import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { LockIcon } from '@/components/ui/FormIcons'
import { TextField } from '@/components/ui/TextField'
import { Button } from '@/components/ui/Button'
import { paths } from '@/constants/paths'
import { resetPasswordWithOtp } from '@/lib/api/authApi'
import { ApiError } from '@/lib/api/apiError'
import { toastApiError } from '@/lib/api/toastApiError'
import {
  resetPasswordFormSchema,
  type ResetPasswordFormValues,
} from '@/lib/validation/authSchemas'

type ResetLocationState = {
  identifier?: string
  /** Passed after successful `/api/auth/verify-otp`; used for reset API, not shown in the form. */
  otp?: string
}

export function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const [busy, setBusy] = useState(false)
  const initialState = (location.state as ResetLocationState | null) ?? {}
  const otp = useMemo(
    () => (initialState.otp ?? '').replace(/\D/g, '').slice(0, 6),
    [initialState.otp],
  )

  const fromState = initialState.identifier
  const fromQuery = searchParams.get('identifier')?.trim() ?? ''
  const identifier = (fromState ?? fromQuery) || ''

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      identifier: '',
      otp: '',
      password: '',
      password_confirmation: '',
    },
  })

  useEffect(() => {
    if (!identifier) {
      navigate(paths.forgotPassword, { replace: true })
    }
  }, [identifier, navigate])

  useEffect(() => {
    if (!identifier || otp.length === 6) {
      return
    }
    navigate(paths.verifyOtp, { state: { identifier }, replace: true })
  }, [identifier, navigate, otp.length])

  useEffect(() => {
    reset({
      identifier,
      otp,
      password: '',
      password_confirmation: '',
    })
  }, [identifier, otp, reset])

  async function onValid(data: ResetPasswordFormValues) {
    if (otp.length < 6) {
      toast.error('Your verification session expired. Enter the code again.')
      navigate(paths.verifyOtp, { state: { identifier }, replace: true })
      return
    }

    setBusy(true)
    try {
      const { token } = await resetPasswordWithOtp(data)
      toast.success('Your password has been updated.')
      if (token) {
        navigate(paths.home, { replace: true })
        return
      }
      navigate(paths.login, { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        toastApiError(err, 'Could not reset password')
      } else {
        toast.error('Something went wrong. Check your network and try again.')
      }
    } finally {
      setBusy(false)
    }
  }

  if (!identifier || otp.length < 6) {
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
          <h1 className="mb-3 text-xl font-semibold">Set new password</h1>
          <p className="text-grocery-500 mt-1 text-sm">
            Account:{' '}
            <span className="text-grocery-800 font-medium break-all">{identifier}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onValid)} className="flex flex-col gap-3" noValidate>
          <input type="hidden" {...register('identifier')} />
          <input type="hidden" {...register('otp')} />
          <div>
            <TextField
              {...register('password')}
              type="password"
              autoComplete="new-password"
              label="New password"
              passwordShowToggle={false}
              startAdornment={<LockIcon />}
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={errors.password ? 'reset-password-error' : undefined}
              inputClassName={
                errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : undefined
              }
            />
            {errors.password ? (
              <p id="reset-password-error" className="text-red-600 mt-1.5 text-xs" role="alert">
                {errors.password.message}
              </p>
            ) : null}
          </div>
          <div>
            <TextField
              {...register('password_confirmation')}
              type="password"
              autoComplete="new-password"
              label="Confirm new password"
              passwordShowToggle={false}
              startAdornment={<LockIcon />}
              aria-invalid={errors.password_confirmation ? true : undefined}
              aria-describedby={
                errors.password_confirmation ? 'reset-password-confirm-error' : undefined
              }
              inputClassName={
                errors.password_confirmation
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                  : undefined
              }
            />
            {errors.password_confirmation ? (
              <p
                id="reset-password-confirm-error"
                className="text-red-600 mt-1.5 text-xs"
                role="alert"
              >
                {errors.password_confirmation.message}
              </p>
            ) : null}
          </div>
          <Button type="submit" loading={busy}>
            Update password
          </Button>
          <p className="text-grocery-500 text-center text-sm">
            <Link
              to={paths.verifyOtp}
              state={{ identifier }}
              className="text-grocery-900 font-medium underline"
            >
              Re-enter code
            </Link>
            {' · '}
            <Link
              to={paths.forgotPassword}
              className="text-grocery-900 font-medium underline"
            >
              Start over
            </Link>
            {' · '}
            <Link to={paths.login} className="text-grocery-900 font-medium underline">
              Back to login
            </Link>
          </p>
        </form>
      </main>
    </div>
  )
}
