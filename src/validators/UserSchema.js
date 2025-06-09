import { z } from "zod";
import permissions from "../utils/permissions";

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
});

export const PermissionsSchema = z
    .array(
        z
            .string()
            .trim()
            .refine((value) => {
                return value in Object.values(permissions);
            })
    )
    .optional();

export const RoleSchema = z.object({
    name: z.string().trim(),
    permissions: PermissionsSchema.optional(),
});

export default UserSchema;
