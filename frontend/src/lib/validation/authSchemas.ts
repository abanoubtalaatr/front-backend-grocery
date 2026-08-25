import { z } from 'zod'

const phoneLike = /^[\d\s+().-]{8,24}$/

export const loginFormSchema = z.object({
  login: z
    .string()
    .trim()
    .min(1, 'Please enter your email or phone number.')
    .max(255),
  password: z.string().min(1, 'Please enter your password.'),
})

export const signUpFormSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(2, 'Username must be at least 2 characters.')
      .max(100),
    email: z.string().trim().email('Please enter a valid email address.'),
    phone: z
      .string()
      .trim()
      .regex(phoneLike, 'Please enter a valid phone number.'),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    password_confirmation: z.string(),
    agree: z
      .boolean()
      .refine((v) => v === true, 'You must agree to the terms and conditions.'),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match.',
    path: ['password_confirmation'],
  })

export const forgotPasswordFormSchema = z.object({
  identifier: z
    .string()
    .trim()
    .min(1, 'Enter your email or phone number.')
    .max(255),
})

export const verifyOtpFormSchema = z.object({
  identifier: z.string().min(1),
  otp: z.string().regex(/^\d{6}$/, 'Enter all 6 digits.'),
})

export const resetPasswordFormSchema = z
  .object({
    identifier: z.string().min(1),
    otp: z.string().length(6),
    password: z.string().min(8, 'Password must be at least 8 characters.'),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: 'Passwords do not match.',
    path: ['password_confirmation'],
  })

export type LoginFormValues = z.infer<typeof loginFormSchema>
export type SignUpFormValues = z.infer<typeof signUpFormSchema>
export type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>
