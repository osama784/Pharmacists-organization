import User from "../../models/user.model.js";
import { NextFunction, Request, TypedResponse } from "express";

const deleteUser = async (req: Request, res: TypedResponse<null>, next: NextFunction) => {
    try {
        const result = await User.deleteOne({ _id: req.params.id });
        if (result.deletedCount != 1) {
            res.status(404).json({ success: false });
            return;
        }
        res.sendStatus(204);
    } catch (e) {
        next(e);
    }
};

export default deleteUser;
