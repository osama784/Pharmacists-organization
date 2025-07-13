import Role from "../../models/role.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { responseMessages } from "../../translation/response.ar.js";
import { RoleResponseDto, toRoleResponseDto } from "../../types/dtos/role.dto.js";

const updateRole = async (req: Request, res: TypedResponse<RoleResponseDto>, next: NextFunction) => {
    try {
        const doc = await Role.findById(req.params.id);
        if (!doc) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        if (doc.name == "SUPER_ADMIN" || doc.name == "EMPTY") {
            res.status(400).json({ success: false, details: [responseMessages.ROLE_CONTROLLERS.PROTECTED_ROLES] });
            return;
        }
        if (!doc) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        await doc.updateOne({ $set: req.validatedData }, { new: true });

        const role = await Role.findById(doc._id);
        res.json({ success: true, data: toRoleResponseDto(role!) });
    } catch (e) {
        next(e);
    }
};

export default updateRole;
