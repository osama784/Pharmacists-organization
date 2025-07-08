import { z } from "zod";
import bcrypt from "bcryptjs";
import Role from "../models/role.model.js";
import { UserStatuses } from "../models/user.model.js";
import { EmailSchema, EnumSchema, mongooseIDSchema, PasswordSchema, StringSchema } from "../utils/customSchemas.js";

const UserSchema = z.object({
    username: StringSchema,
    email: EmailSchema,
    password: PasswordSchema.transform(async (value) => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(value, salt);

        return hash;
    }),
    phoneNumber: StringSchema,
    status: EnumSchema(Object.values(UserStatuses) as [string]).default(UserStatuses.active),
    role: mongooseIDSchema(Role),
});

export const UserUpdateSchema = UserSchema.omit({ password: true }).partial();

export default UserSchema;
