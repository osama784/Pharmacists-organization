import { Request, TypedResponse, NextFunction } from "express";
import Role from "../../models/role.model";
import { RoleDocument } from "../../types/models/role.types";
import { responseMessages } from "../../translation/response.ar";

const getRole = async (req: Request, res: TypedResponse<RoleDocument>, next: NextFunction) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        res.json({ success: true, data: role });
    } catch (e) {
        next(e);
    }
};

export default getRole;
