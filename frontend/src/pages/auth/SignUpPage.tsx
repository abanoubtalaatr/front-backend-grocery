import { useState } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { EnvelopeIcon, LockIcon, PhoneIcon, UserIcon } from '@/components/ui/FormIcons'
import { TextField } from '@/components/ui/TextField'
import { Button } from '@/components/ui/Button'
import { paths } from '@/constants/paths'
import { registerAccount } from '@/lib/api/authApi'
import { ApiError } from '@/lib/api/apiError'
import { toastApiError } from '@/lib/api/toastApiError'
import { signUpFormSchema, type SignUpFormValues } from '@/lib/validation/authSchemas'

export function SignUpPage() {
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      username: '',
      email: '',
      phone: '',
      password: '',
      password_confirmation: '',
      agree: false,
    },
  })

  const agree = useWatch({ control, name: 'agree' })

  async function onValid(data: SignUpFormValues) {
    setBusy(true)
    try {
      await registerAccount({
        username: data.username,
        email: data.email,
        phone: data.phone,
        password: data.password,
        password_confirmation: data.password_confirmation,
        agree_terms: 1,
      })
      toast.success('Account created successfully.')
      navigate(paths.home, { replace: true })
    } catch (err) {
      if (err instanceof ApiError) {
        toastApiError(err, 'Could not create account')
      } else {
        toast.error('Something went wrong. Check your network and try again.')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="bg-grocery-50/40 flex w-full">
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
          <h1 className="mb-3 text-xl font-semibold">Create your Account</h1>
          <p className="text-grocery-500 mb-30 mt-1 text-sm">Just a few things to get started</p>
        </div>

        <form onSubmit={handleSubmit(onValid)} className="flex flex-col gap-3" noValidate>
          <div>
            <TextField
              {...register('username')}
              autoComplete="username"
              label="Username"
              startAdornment={<UserIcon />}
              aria-invalid={errors.username ? true : undefined}
              aria-describedby={errors.username ? 'username-error' : undefined}
              inputClassName={
                errors.username ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : undefined
              }
            />
            {errors.username ? (
              <p id="username-error" className="text-red-600 mt-1.5 text-xs" role="alert">
                {errors.username.message}
              </p>
            ) : null}
          </div>
          <div>
            <TextField
              {...register('email')}
              type="email"
              inputMode="email"
              autoComplete="email"
              label="Email"
              startAdornment={<EnvelopeIcon />}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? 'email-error' : undefined}
              inputClassName={errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : undefined}
            />
            {errors.email ? (
              <p id="email-error" className="text-red-600 mt-1.5 text-xs" role="alert">
                {errors.email.message}
              </p>
            ) : null}
          </div>
          <div>
            <TextField
              {...register('phone')}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              label="Phone number"
              startAdornment={<PhoneIcon />}
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? 'phone-error' : undefined}
              inputClassName={errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : undefined}
            />
            {errors.phone ? (
              <p id="phone-error" className="text-red-600 mt-1.5 text-xs" role="alert">
                {errors.phone.message}
              </p>
            ) : null}
          </div>
          <div>
            <TextField
              {...register('password')}
              type="password"
              autoComplete="new-password"
              label="Password"
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
          <div>
            <TextField
              {...register('password_confirmation')}
              type="password"
              autoComplete="new-password"
              label="Confirm password"
              startAdornment={<LockIcon />}
              aria-invalid={errors.password_confirmation ? true : undefined}
              aria-describedby={errors.password_confirmation ? 'password_confirmation-error' : undefined}
              inputClassName={
                errors.password_confirmation
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                  : undefined
              }
            />
            {errors.password_confirmation ? (
              <p
                id="password_confirmation-error"
                className="text-red-600 mt-1.5 text-xs"
                role="alert"
              >
                {errors.password_confirmation.message}
              </p>
            ) : null}
          </div>
          <div>
            <label className="text-grocery-600 flex cursor-pointer items-start gap-3 text-sm">
              <input
                type="checkbox"
                {...register('agree')}
                className="text-grocery-900 mt-0.5 h-4 w-4 rounded border-grocery-300"
              />
              I agree to the terms and conditions
            </label>
            {errors.agree ? (
              <p className="text-red-600 mt-1.5 text-xs" role="alert">
                {errors.agree.message}
              </p>
            ) : null}
          </div>
          <Button type="submit" disabled={!agree} loading={busy}>
            Sign up
          </Button>
          <p className="text-grocery-500 pb-10 text-center text-sm">
            Already have an account?{' '}
            <Link className="text-grocery-900 font-medium underline" to={paths.login}>
              Login
            </Link>
          </p>
        </form>
      </main>
    </div>
  )
}
