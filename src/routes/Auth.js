import passport from "passport";
import "../auth/localStrategy.js";
import "../auth/JWTStrategy.js";
import { Router } from "express";
import validate from "../middlewares/validate.js";
import { loginSchema, resetPasswordSchema, sendPasswordResetEmailSchema } from "../validators/AuthSchema.js";
import initiatePasswordReset from "../controllers/Auth/initiatePasswordReset.js";
import resetPassword from "../controllers/Auth/resetPassword.js";
import { generateToken } from "../auth/JWTStrategy.js";

const router = Router();

router.post("/login", validate(loginSchema), passport.authenticate("local", { session: false }), (req, res) => {
    const token = generateToken(req.user);
    res.json({ success: true, data: { user: req.user, token } });
});

router.post("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);

        // Destroy the session
        req.session.destroy((err) => {
            if (err) return next(err);

            // Clear the session cookie
            res.clearCookie("connect.sid"); // Default session cookie name
            res.json({ success: true }); // Redirect after logout
        });
    });
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
