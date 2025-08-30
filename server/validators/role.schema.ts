import { z } from "zod";
import permissions from "../utils/permissions.js";
import { EnumSchema, StringSchema } from "../utils/customSchemas.js";
import { RoleModelTR } from "../translation/models.ar.js";

const RoleSchema = z.object({
    name: StringSchema({ keyName: RoleModelTR.name }),
    permissions: z.array(EnumSchema({ data: Object.values(permissions) as [string], keyName: RoleModelTR.permissions })),
});

export default RoleSchema;
