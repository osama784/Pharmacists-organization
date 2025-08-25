import { Request, TypedResponse, NextFunction } from "express";
import Role from "../../models/role.model";
import { responseMessages } from "../../translation/response.ar";
import { RoleResponseDto, toRoleResponseDto } from "../../types/dtos/role.dto";

const getRole = async (req: Request, res: TypedResponse<RoleResponseDto>, next: NextFunction) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        res.json({ success: true, data: toRoleResponseDto(role) });
    } catch (e) {
        next(e);
    }
};

export default getRole;
