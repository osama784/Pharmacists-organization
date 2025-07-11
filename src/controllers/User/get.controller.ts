import { NextFunction, Request, TypedResponse } from "express";
import User from "../../models/user.model.js";
import { UserDocument } from "../../types/models/user.types";
import { responseMessages } from "../../translation/response.ar.js";

const getUser = async (req: Request, res: TypedResponse<UserDocument>, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        res.json({ success: true, data: user });
    } catch (e) {
        next(e);
    }
};

export default getUser;
