import User from "../../models/User.js";
import { sendPasswordResetEmail } from "../../utils/mailer.js";
import crypto from "crypto";

const initiatePasswordReset = async (req, res, next) => {
    try {
        const email = req.validatedData.email;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ success: false, message: "user with the given email not found" });
            reuturn;
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
