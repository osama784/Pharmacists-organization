import Role from "../../models/role.model.js";
import { NextFunction, Request, TypedResponse } from "express";

const deleteRole = async (req: Request, res: TypedResponse<null>, next: NextFunction) => {
    try {
        const doc = await Role.findById(req.params.id);
        if (!doc) {
            res.status(404).json({ success: false });
            return;
        }
        if (doc.name == "SUPER_ADMIN" || doc.name == "EMPTY") {
            res.status(400).json({ success: false, details: ["you can't delete fixed roles (SUPER_ADMIN, EMPTY)"] });
            return;
        }
        await doc.deleteOne();
        res.sendStatus(204);
    } catch (e) {
        next(e);
    }
};

export default deleteRole;
