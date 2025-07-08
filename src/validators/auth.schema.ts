import { z } from "zod";
import { EmailSchema, StringSchema, PasswordSchema } from "../utils/customSchemas";

export const loginSchema = z.object({
    email: EmailSchema,
    password: PasswordSchema,
});

export const sendPasswordResetEmailSchema = z.object({
    email: EmailSchema,
});

export const resetPasswordSchema = z.object({
    email: EmailSchema,
    resetToken: StringSchema,
    password: PasswordSchema,
});
