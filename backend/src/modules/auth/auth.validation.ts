import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, 'Full name must be at least 3 characters')
    .max(100),

  email: z
    .email('Invalid email address')
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(8, 'Password must contain at least 8 characters')
    .max(100),
});

export const loginSchema = z.object({
  email: z
    .email('Invalid email address')
    .transform((value) => value.toLowerCase()),

  password: z
    .string()
    .min(1, 'Password is required'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;