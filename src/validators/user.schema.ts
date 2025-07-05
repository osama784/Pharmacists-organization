import { z } from "zod";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import Role from "../models/role.model.js";
import { UserStatuses } from "../models/user.model.js";

const UserSchema = z.object({
    username: z.string().nonempty().trim(),
    email: z.string().email(),
    password: z
        .string()
        .min(4)
        .trim()
        .transform(async (value) => {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(value, salt);

            return hash;
        }),
    phoneNumber: z.string().nonempty().trim(),
    status: z.enum(Object.values(UserStatuses) as [string]).default(UserStatuses.active),
    role: z
        .string()
        .trim()
        .refine(async (value) => {
            if (!mongoose.Types.ObjectId.isValid(value)) {
                return false;
            }
            const exists = await Role.exists({ _id: value });
            if (exists) {
                return true;
            }
            return false;
        }, "please send a valid Role ID"),
});

export const UserUpdateSchema = UserSchema.omit({ password: true }).partial();

export default UserSchema;
