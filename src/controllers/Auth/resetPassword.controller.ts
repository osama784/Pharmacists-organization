import { NextFunction, Request, Response, TypedResponse } from "express";
import User from "../../models/user.model.js";
import bcrypt from "bcryptjs";
import { UserDocument } from "../../types/models/user.types.js";

const resetPassword = async (req: Request, res: TypedResponse<UserDocument>, next: NextFunction) => {
    try {
        const user = await User.findOne({
            email: req.validatedData.email,
            resetPasswordToken: req.validatedData.resetToken,
        });
        if (!user) {
            res.status(404).json({ success: false, details: ["email or reset token is incorrect"] });
            return;
        }
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.validatedData.password, salt);
        user.password = hash;

        await user.save();
        const doc = await User.findById(user._id);
        res.json({ success: true, data: doc! });
    } catch (e) {
        next(e);
    }
};

export default resetPassword;
