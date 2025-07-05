import { z } from "zod";
import permissions from "../utils/permissions.js";

const RoleSchema = z.object({
    name: z.string().trim(),
    permissions: z.array(
        z
            .string()
            .trim()
            .refine((value) => {
                return Object.values(permissions).includes(value);
            }, "this permission doesn't exist in the DB")
    ),
});

export default RoleSchema;
