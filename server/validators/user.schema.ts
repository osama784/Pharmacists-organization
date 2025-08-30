import { z } from "zod";
import bcrypt from "bcryptjs";
import { UserStatuses } from "../models/user.model.js";
import { EmailSchema, EnumSchema, mongooseIDSchema, PasswordSchema, StringSchema } from "../utils/customSchemas.js";
import { UserModelTR } from "../translation/models.ar.js";

const UserSchema = z.object({
    username: StringSchema({ keyName: UserModelTR.username }),
    email: EmailSchema({ keyName: UserModelTR.email }),
    password: PasswordSchema({ keyName: UserModelTR.password }).transform(async (value) => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(value, salt);

        return hash;
    }),
    phoneNumber: StringSchema({ keyName: UserModelTR.phoneNumber }),
    status: EnumSchema({ data: Object.values(UserStatuses) as [string], keyName: UserModelTR.status }).default(UserStatuses.active),
    role: mongooseIDSchema({ keyName: UserModelTR.role }),
});

export const UserUpdateSchema = UserSchema.omit({ password: true }).partial();

export default UserSchema;
