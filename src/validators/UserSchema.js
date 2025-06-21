import { z } from "zod";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const UserSchema = z.object({
    username: z.string().trim(),
    email: z.string().email(),
    password: z
        .string()
        .trim()
        .transform(async (value) => {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(value, salt);

            return hash;
        }),
    phoneNumber: z.string().trim().optional(),
    role: z
        .string()
        .trim()
        .refine((value) => {
            return mongoose.Types.ObjectId.isValid(value);
        }, "please send a valid Role ID"),
});

export const UserUpdateSchema = UserSchema.omit({ password: true }).partial();

export default UserSchema;
