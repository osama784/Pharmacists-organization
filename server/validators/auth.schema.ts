import { z } from "zod";
import { EmailSchema, StringSchema, PasswordSchema } from "../utils/customSchemas";
import { AuthTR } from "../translation/models.ar";

export const loginZodSchema = z.object({
    email: EmailSchema({ keyName: AuthTR.email }),
    password: StringSchema({ keyName: AuthTR.password }),
});

export const sendPasswordResetEmailSchema = z.object({
    email: EmailSchema({ keyName: AuthTR.email }),
});

export const passwordResetZodSchema = z.object({
    email: EmailSchema({ keyName: AuthTR.email }),
    resetToken: StringSchema({ keyName: AuthTR.resetToken }),
    password: PasswordSchema({ keyName: AuthTR.password }),
});
