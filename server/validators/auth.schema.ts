import { z } from "zod";
import { EmailSchema, StringSchema, PasswordSchema } from "../utils/customSchemas";
import { AuthTR } from "../translation/models.ar";

export const loginSchema = z.object({
    email: EmailSchema(AuthTR.email),
    password: PasswordSchema(AuthTR.password),
});

export const sendPasswordResetEmailSchema = z.object({
    email: EmailSchema(AuthTR.email),
});

export const resetPasswordSchema = z.object({
    email: EmailSchema(AuthTR.email),
    resetToken: StringSchema(AuthTR.resetToken),
    password: PasswordSchema(AuthTR.password),
});
