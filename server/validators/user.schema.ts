import { z } from "zod";
import bcrypt from "bcryptjs";
import Role from "../models/role.model.js";
import { UserStatuses } from "../models/user.model.js";
import { EmailSchema, EnumSchema, mongooseIDSchema, PasswordSchema, StringSchema } from "../utils/customSchemas.js";
import { UserModelTR } from "../translation/models.ar.js";

const UserSchema = z.object({
    username: StringSchema(UserModelTR.username),
    email: EmailSchema(UserModelTR.email),
    password: PasswordSchema(UserModelTR.password).transform(async (value) => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(value, salt);

        return hash;
    }),
    phoneNumber: StringSchema(UserModelTR.phoneNumber),
    status: EnumSchema(Object.values(UserStatuses) as [string], UserModelTR.status).default(UserStatuses.active),
    role: mongooseIDSchema(Role, UserModelTR.role),
});

export const UserUpdateSchema = UserSchema.omit({ password: true }).partial();

export default UserSchema;
