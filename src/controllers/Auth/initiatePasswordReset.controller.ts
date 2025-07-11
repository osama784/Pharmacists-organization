import User from "../../models/user.model.js";
import { NextFunction, Request, Response, TypedResponse } from "express";
import { sendPasswordResetEmail } from "../../utils/mailer.js";
import crypto from "crypto";
import { responseMessages } from "../../translation/response.ar.js";

const initiatePasswordReset = async (req: Request, res: TypedResponse<null>, next: NextFunction) => {
    try {
        const email = req.validatedData.email;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        const resetToken = crypto.randomBytes(6).toString("hex");
        user.resetPasswordToken = resetToken;
        await user.save();

        await sendPasswordResetEmail(email, {
            username: user.username,
            resetToken,
        });
        res.json({ success: true });
    } catch (e) {
        next(e);
    }
};

export default initiatePasswordReset;
