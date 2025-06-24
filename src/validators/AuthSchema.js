import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const sendPasswordResetEmailSchema = z.object({
    email: z.string().email(),
});

export const resetPasswordSchema = z.object({
    email: z.string().email(),
    resetToken: z.string(),
    password: z.string().trim(),
});
