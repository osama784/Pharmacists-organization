import { NextFunction, Request, TypedResponse } from "express";
import Role from "../../models/role.model.js";
import { CreateRoleDto, RoleResponseDto, toRoleResponseDto } from "../../types/dtos/role.dto.js";
import { responseMessages } from "../../translation/response.ar.js";

const createRole = async (req: Request, res: TypedResponse<RoleResponseDto>, next: NextFunction) => {
    try {
        const validatedData: CreateRoleDto = req.validatedData;
        const roleName = validatedData.name;
        const exists = await Role.checkUniqueName(roleName);
        if (exists) {
            res.status(400).json({ success: false, details: [responseMessages.ROLE_CONTROLLERS.UNIQUE_NAME] });
            return;
        }
        const role = await Role.create(validatedData);
        res.json({ success: true, data: toRoleResponseDto(role) });
    } catch (e) {
        next(e);
    }
};

export default createRole;
