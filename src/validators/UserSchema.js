import { z } from "zod";
import permissions from "../utils/permissions.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const UserSchema = z.object({
    username: z.string().trim(),
    password: z
        .string()
        .trim()
        .transform(async (value) => {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(value, salt);

            return hash;
        }),
    role: z
        .string()
        .trim()
        .refine((value) => {
            return mongoose.Types.ObjectId.isValid(value);
        })
        .optional(),
});

export const PermissionsSchema = z
    .array(
        z
            .string()
            .trim()
            .refine((value) => {
                return Object.values(permissions).includes(value);
            }, "this permission doesn't exist on the server")
    )
    .optional();

export const RoleSchema = z.object({
    name: z.string().trim(),
    permissions: PermissionsSchema.optional(),
});

export default UserSchema;
