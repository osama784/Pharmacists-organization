import { z } from "zod";
import { EmailSchema, StringSchema, PasswordSchema } from "../utils/customSchemas";
import { AuthTR } from "../translation/models.ar";

export const loginSchema = z.object({
    email: EmailSchema({ keyName: AuthTR.email }),
    password: PasswordSchema({ keyName: AuthTR.password }),
});

export const sendPasswordResetEmailSchema = z.object({
    email: EmailSchema({ keyName: AuthTR.email }),
});

export const resetPasswordSchema = z.object({
    email: EmailSchema({ keyName: AuthTR.email }),
    resetToken: StringSchema({ keyName: AuthTR.resetToken }),
    password: PasswordSchema({ keyName: AuthTR.password }),
});
