import { NextFunction, Request, TypedResponse } from "express";
import Role from "../../models/role.model.js";
import { RoleDocument } from "../../types/models/role.types.js";
import { createRoleDto } from "../../types/dtos/role.dto.js";

const createRole = async (req: Request, res: TypedResponse<RoleDocument>, next: NextFunction) => {
    try {
        const validatedData: createRoleDto = req.validatedData;
        const roleName = validatedData.name;
        const exists = await Role.checkUniqueName(roleName);
        if (exists) {
            res.status(400).json({ success: false, details: ["role name is taken"] });
            return;
        }
        const role = await Role.create(validatedData);
        res.json({ success: true, data: role });
    } catch (e) {
        next(e);
    }
};

export default createRole;
