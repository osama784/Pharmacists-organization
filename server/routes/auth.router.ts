import passport from "passport";
import "../auth/localStrategy.js";
import "../auth/JWTStrategy.js";
import { Request, Router, TypedResponse } from "express";
import validate from "../middlewares/validate.middleware.js";
import { LoginSchema, PasswordResetSchema, sendPasswordResetEmailSchema } from "../validators/auth.schema.js";
import initiatePasswordReset from "../controllers/Auth/initiatePasswordReset.controller.js";
import resetPassword from "../controllers/Auth/resetPassword.controller.js";
import { generateToken } from "../auth/JWTStrategy.js";
import { PopulatedUserDocument } from "../types/models/user.types.js";

const router = Router();

router.post(
    "/login",
    validate(LoginSchema),
    passport.authenticate("local", { session: false }),
    (req: Request, res: TypedResponse<{ user: PopulatedUserDocument; token: string }>) => {
        const token = generateToken(req.user!);
        res.json({ success: true, data: { user: req.user!, token } });
    }
);

router.post("/forgot-password", validate(sendPasswordResetEmailSchema), initiatePasswordReset);
router.patch("/reset-password", validate(PasswordResetSchema), resetPassword);

export default router;
