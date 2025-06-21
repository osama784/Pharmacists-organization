import passport from "passport";
import "../auth/localStrategy.js";
import { Router } from "express";

const router = Router();

router.post(
    "/login",
    (req, res, next) => {
        if (!req.body.email || !req.body.password) {
            res.status(400).json({
                success: false,
                message: "invalid information",
            });
            return;
        }
        next();
    },
    passport.authenticate("local"),
    (req, res) => {
        res.json({ success: true, data: req.user });
    }
);

router.post("/status", (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json({ success: true, data: req.user });
    } else {
        res.status(401).json({ success: false });
    }
});

export default router;
