import Role from "../../models/role.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { responseMessages } from "../../translation/response.ar.js";

const deleteRole = async (req: Request, res: TypedResponse<null>, next: NextFunction) => {
    try {
        const doc = await Role.findById(req.params.id);
        if (!doc) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        if (doc.name == "مدير عام" || doc.name == "بلا صلاحيات") {
            res.status(400).json({ success: false, details: [responseMessages.ROLE_CONTROLLERS.PROTECTED_ROLES] });
            return;
        }
        await doc.deleteOne();
        res.sendStatus(204);
    } catch (e) {
        next(e);
    }
};

export default deleteRole;
