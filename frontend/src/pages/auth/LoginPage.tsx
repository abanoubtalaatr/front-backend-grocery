import { useEffect, useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { toast } from 'sonner'
import { FacebookIcon, GoogleIcon, EnvelopeIcon, LockIcon } from '@/components/ui/FormIcons'
import { TextField } from '@/components/ui/TextField'
import { paths } from '@/constants/paths'
import { loginWithPassword, redirectToGoogleLogin } from '@/lib/api/authApi'
import { ApiError } from '@/lib/api/apiError'
import { toastApiError } from '@/lib/api/toastApiError'
import { cn } from '@/lib/cn'
import { loginFormSchema, type LoginFormValues } from '@/lib/validation/authSchemas'

function SocialCardButton({
  className,
  type = 'button',
  onClick,
  children,
  'aria-label': ariaLabel,
}: {
  className?: string
  type?: 'button' | 'submit'
  onClick?: () => void
  children: ReactNode
  'aria-label'?: string
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        'border-sky-100/80 bg-sky-50/90 text-grocery-800 hover:bg-sky-100/80 flex h-12 flex-1 items-center justify-center gap-2 rounded-xl',
        'text-sm font-medium transition',
        className,
      )}
    >
      {children}
    </button>
  )
}

export function LoginPage() {
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    if (searchParams.get('session') === 'expired') {
      toast.info('Your session expired. Please sign in again.')
      searchParams.delete('session')
      setSearchParams(searchParams, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: { login: '', password: '' },
  })

  async function onValid(data: LoginFormValues) {
    setBusy(true)
    try {
      await loginWithPassword(data)
      toast.success('Welcome back!')
      navigate(paths.home, { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        toastApiError(err, 'Could not sign in')
      } else {
        toast.error('Something went wrong. Check your network and try again.')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-grocery-950/95 flex min-h-svh w-full ">
      <div
        className="border-grocery-200/5 flex w-full  flex-col overflow-hidden  border bg-white shadow-2xl ring-1 ring-white/5 md:flex-row"
        role="dialog"
        aria-label="Log in to Grocery Plus"
      >
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

        <div className="text-grocery-800 flex w-full flex-1 flex-col justify-center px-6 py-8 sm:px-10 sm:py-10 md:max-w-[60%]">
          <div className="mb-6 space-y-1 text-left">
            <h1 className="text-2xl font-bold tracking-tight text-black sm:text-[1.65rem]">
              Login your account!
            </h1>
            <p className="text-grocery-500 text-sm sm:text-base">Welcome to Grocery Plus</p>
          </div>

          <form onSubmit={handleSubmit(onValid)} className="space-y-4" noValidate>
            <div>
              <TextField
                {...register('login')}
                type="email"
                inputMode="email"
                autoComplete="username"
                label="Email or phone"
                startAdornment={<EnvelopeIcon />}
                aria-invalid={errors.login ? true : undefined}
                aria-describedby={errors.login ? 'login-error' : undefined}
                inputClassName={errors.login ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : undefined}
              />
              {errors.login ? (
                <p id="login-error" className="text-red-600 mt-1.5 text-xs" role="alert">
                  {errors.login.message}
                </p>
              ) : null}
            </div>
            <div>
              <TextField
                {...register('password')}
                type="password"
                autoComplete="current-password"
                label="Password"
                passwordShowToggle={false}
                startAdornment={<LockIcon />}
                aria-invalid={errors.password ? true : undefined}
                aria-describedby={errors.password ? 'password-error' : undefined}
                inputClassName={
                  errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : undefined
                }
              />
              {errors.password ? (
                <p id="password-error" className="text-red-600 mt-1.5 text-xs" role="alert">
                  {errors.password.message}
                </p>
              ) : null}
            </div>
            <div className="w-full text-left">
              <button
                type="button"
                onClick={() => {
                  void navigate(paths.forgotPassword)
                }}
                className="text-grocery-500 cursor-pointer border-0 bg-transparent p-0 text-sm font-medium hover:text-grocery-800 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="from-grocery-900 to-sky-600 h-12 w-full rounded-[10px] bg-gradient-to-b text-sm font-semibold text-white shadow-sm transition enabled:hover:opacity-95 enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? '…' : 'Continue'}
            </button>
          </form>

          <p className="text-grocery-500 mt-7 text-center text-sm">Or continue with</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <SocialCardButton
              type="button"
              aria-label="Continue with Google"
              onClick={redirectToGoogleLogin}
            >
              <GoogleIcon className="h-6 w-6" />
              <span>Continue with Google</span>
            </SocialCardButton>
            <SocialCardButton
              type="button"
              aria-label="Continue with Facebook"
              onClick={() => toast.info('Facebook sign-in is not connected yet.')}
            >
              <FacebookIcon className="h-6 w-6" />
              <span>Continue with Facebook</span>
            </SocialCardButton>
          </div>

          <p className="text-grocery-500 mt-8 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link className="text-sky-600 font-bold hover:underline" to={paths.signUp}>
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
