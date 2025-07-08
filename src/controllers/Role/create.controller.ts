import { NextFunction, Request, TypedResponse } from "express";
import Role from "../../models/role.model.js";
import { RoleDocument } from "../../types/models/role.types.js";
import { createRoleDto } from "../../types/dtos/role.dto.js";
import { responseMessages } from "../../translation/response.ar.js";

const createRole = async (req: Request, res: TypedResponse<RoleDocument>, next: NextFunction) => {
    try {
        const validatedData: createRoleDto = req.validatedData;
        const roleName = validatedData.name;
        const exists = await Role.checkUniqueName(roleName);
        if (exists) {
            res.status(400).json({ success: false, details: [responseMessages.ROLE_CONTROLLERS.UNIQUE_NAME] });
            return;
        }
        const role = await Role.create(validatedData);
        res.json({ success: true, data: role });
    } catch (e) {
        next(e);
    }
};

export default createRole;
