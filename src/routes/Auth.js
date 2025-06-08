import passport from "passport";
import "../auth/localStrategy";

const router = Router();

router.post("/login", passport.authenticate("local"), (req, res) => {
    res.status(200);
});

router.post("/status", (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200);
    } else {
        res.status(401);
    }
});

export default router;
