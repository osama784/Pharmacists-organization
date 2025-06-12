import passport from "passport";
import "../auth/localStrategy.js";
import { Router } from "express";

const router = Router();

router.post("/login", passport.authenticate("local"), (req, res) => {
    res.sendStatus(200);
});

router.post("/status", (req, res) => {
    if (req.isAuthenticated()) {
        res.sendStatus(200);
    } else {
        res.sendStatus(401);
    }
});

export default router;
