import User from "../../models/user.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { responseMessages } from "../../translation/response.ar.js";

const deleteUser = async (req: Request, res: TypedResponse<null>, next: NextFunction) => {
    try {
        const result = await User.deleteOne({ _id: req.params.id });
        if (result.deletedCount != 1) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        res.sendStatus(204);
    } catch (e) {
        next(e);
    }
};

export default deleteUser;
