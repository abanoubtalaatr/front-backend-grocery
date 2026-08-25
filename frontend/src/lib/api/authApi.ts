import axios from 'axios'
import { env } from '@/config/env'
import { ApiError } from '@/lib/api/apiError'
import { apiClient, publicApiClient } from '@/lib/api/httpClient'
import {
  extractAccessToken,
  extractUserFromAuthResponse,
  getErrorMessageFromBody,
} from '@/lib/auth/parseApiResponse'
import { clearStoredUser, setStoredToken, setStoredUser } from '@/lib/auth/authTokenStorage'

function persistUserFromAuthResponse(raw: unknown) {
  const user = extractUserFromAuthResponse(raw)
  if (user) {
    setStoredUser(user)
  } else {
    clearStoredUser()
  }
}

async function postAuthJson(
  path: string,
  body: unknown,
  getMessage: (raw: unknown, status: number) => string,
): Promise<{ raw: unknown; status: number }> {
  try {
    const res = await publicApiClient.post<unknown>(path, body)
    return { raw: res.data, status: res.status }
  } catch (err) {
    if (axios.isAxiosError(err) && err.response) {
      const status = err.response.status
      const raw = err.response.data ?? {}
      throw new ApiError(getMessage(raw, status), status, raw)
    }
    throw err
  }
}

export type LoginRequestBody = {
  /** Email or phone — matches backend `login` field. */
  login: string
  password: string
}

export type LoginResult = { token: string; raw: unknown }

export async function loginWithPassword(body: LoginRequestBody): Promise<LoginResult> {
  const { raw, status } = await postAuthJson(
    '/api/auth/login',
    { login: body.login, password: body.password },
    (raw, status) =>
      getErrorMessageFromBody(
        raw,
        status === 401 || status === 422
          ? 'Please check your credentials and try again.'
          : 'Could not sign you in. Try again in a moment.',
      ),
  )

  const token = extractAccessToken(raw)
  if (!token) {
    throw new ApiError('Signed in, but the server did not return a token.', status, raw)
  }

  setStoredToken(token)
  persistUserFromAuthResponse(raw)
  return { token, raw }
}

export type RegisterRequestBody = {
  username: string
  email: string
  phone: string
  password: string
  password_confirmation: string
  agree_terms: 0 | 1
}

export type RegisterResult = { token: string | null; raw: unknown }

export async function registerAccount(body: RegisterRequestBody): Promise<RegisterResult> {
  const { raw } = await postAuthJson('/api/auth/register', body, (raw, status) =>
    getErrorMessageFromBody(
      raw,
      status === 422
        ? 'Please check your details and try again.'
        : 'Could not complete registration. Try again in a moment.',
    ),
  )

  const token = extractAccessToken(raw)
  if (token) {
    setStoredToken(token)
    persistUserFromAuthResponse(raw)
  }
  return { token, raw }
}

export type ForgotPasswordBody = {
  identifier: string
}

export async function requestForgotPassword(body: ForgotPasswordBody) {
  const { raw } = await postAuthJson(
    '/api/auth/forgot-password',
    { identifier: body.identifier },
    (raw) =>
      getErrorMessageFromBody(raw, 'Could not send the reset code. Please try again.'),
  )

  return { raw }
}

export type VerifyOtpBody = {
  identifier: string
  otp: string
}

export type VerifyOtpResult = { token: string | null; raw: unknown }

export async function verifyPasswordOtp(body: VerifyOtpBody): Promise<VerifyOtpResult> {
  const { raw } = await postAuthJson(
    '/api/auth/verify-otp',
    {
      identifier: body.identifier,
      otp: body.otp,
    },
    (raw) =>
      getErrorMessageFromBody(raw, 'Invalid or expired code. Please try again.'),
  )

  const token = extractAccessToken(raw)
  if (token) {
    setStoredToken(token)
    persistUserFromAuthResponse(raw)
  }
  return { token, raw }
}

export type ResetPasswordBody = {
  identifier: string
  otp: string
  password: string
  password_confirmation: string
}

export type ResetPasswordResult = { token: string | null; raw: unknown }

export async function resetPasswordWithOtp(
  body: ResetPasswordBody,
): Promise<ResetPasswordResult> {
  const { raw } = await postAuthJson(
    '/api/auth/reset-password',
    {
      identifier: body.identifier,
      otp: body.otp,
      password: body.password,
      password_confirmation: body.password_confirmation,
    },
    (raw, status) =>
      getErrorMessageFromBody(
        raw,
        status === 422
          ? 'Please check your code and password fields.'
          : 'Could not reset password. Try again in a moment.',
      ),
  )

  const token = extractAccessToken(raw)
  if (token) {
    setStoredToken(token)
    persistUserFromAuthResponse(raw)
  }
  return { token, raw }
}

/** POST `/api/auth/logout` with the current Bearer token. Clear local storage in the UI after. */
export async function logoutSession(): Promise<void> {
  await apiClient.post('/api/auth/logout')
}

/**
 * Starts Google OAuth with POST (some backends reject GET for this route).
 * Uses a temporary form submit so browser can follow server redirects.
 */
export function redirectToGoogleLogin(): void {
  if (typeof window === 'undefined') {
    return
  }
  const form = window.document.createElement('form')
  form.method = 'POST'
  form.action = env.googleLoginUrl
  form.style.display = 'none'
  window.document.body.appendChild(form)
  form.submit()
}