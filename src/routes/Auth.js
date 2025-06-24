import passport from "passport";
import "../auth/localStrategy.js";
import { Router } from "express";
import validate from "../middlewares/validate.js";
import { loginSchema, resetPasswordSchema, sendPasswordResetEmailSchema } from "../validators/AuthSchema.js";
import initiatePasswordReset from "../controllers/Auth/initiatePasswordReset.js";
import resetPassword from "../controllers/Auth/resetPassword.js";

const router = Router();

router.post("/login", validate(loginSchema), passport.authenticate("local"), (req, res) => {
    res.json({ success: true, data: req.user });
});

router.post("/forgot-password", validate(sendPasswordResetEmailSchema), initiatePasswordReset);
router.patch("/reset-password", validate(resetPasswordSchema), resetPassword);

router.post("/status", (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({ success: true, data: req.user });
    } else {
        res.status(401).json({ success: false });
    }
});

export default router;
