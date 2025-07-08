import Role from "../../models/role.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { RoleDocument } from "../../types/models/role.types.js";
import { responseMessages } from "../../translation/response.ar.js";

const updateRole = async (req: Request, res: TypedResponse<RoleDocument>, next: NextFunction) => {
    try {
        const doc = await Role.findById(req.params.id);
        if (!doc) {
            res.status(404);
            return;
        }
        if (doc.name == "SUPER_ADMIN" || doc.name == "EMPTY") {
            res.status(400).json({ success: false, details: [responseMessages.ROLE_CONTROLLERS.PROTECTED_ROLES] });
            return;
        }
        if (!doc) {
            res.status(404);
            return;
        }
        await doc.updateOne({ $set: req.validatedData }, { new: true });

        const newDoc = await Role.findById(doc._id);
        res.json({ success: true, data: newDoc! });
    } catch (e) {
        next(e);
    }
};

export default updateRole;
