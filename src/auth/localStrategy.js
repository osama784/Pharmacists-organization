import passport from "passport";
import { Strategy } from "passport-local";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import AppError from "../utils/AppError.js";

export default (function initPassport() {
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            if (!user) {
                done(new Error("user not found"), null);
                return;
            }
            const populatedUser = await user.populate("role");
            done(null, populatedUser);
        } catch (e) {
            done(e, null);
        }
    });

    passport.use(
        new Strategy(async (username, password, done) => {
            try {
                const user = await User.findOne({
                    username: username,
                });
                if (!user) {
                    return done(new AppError("username or password is incorrect", 400), false);
                }
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(new AppError("username or password is incorrect", 400), false);
                }
                done(null, user);
            } catch (e) {
                done(e, false);
            }
        })
    );
})();
