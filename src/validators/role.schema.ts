import { z } from "zod";
import permissions from "../utils/permissions.js";
import { EnumSchema, StringSchema } from "../utils/customSchemas.js";

const RoleSchema = z.object({
    name: StringSchema(),
    permissions: z.array(EnumSchema(Object.values(permissions) as [string])),
});

export default RoleSchema;
