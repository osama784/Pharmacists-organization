import User from "../../models/user.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { UserDocument } from "../../types/models/user.types.js";

const updateUser = async (req: Request, res: TypedResponse<UserDocument>, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ success: false });
            return;
        }
        const email = req.validatedData.email;
        if (email) {
            const exists = await User.checkUniqueEmail(req.params.id, email);

            if (exists) {
                res.status(400).json({ success: false, details: ["email is taken"] });
                return;
            }
        }
        await user.updateOne({ $set: req.validatedData });
        const doc = await User.findById(user._id);
        res.json({ success: true, data: doc! });
    } catch (e) {
        next(e);
    }
};

export default updateUser;
