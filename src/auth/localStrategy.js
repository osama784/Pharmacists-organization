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
            const user = await User.findById(id).populate("role");
            if (!user) {
                done(new AppError("user with the ID in the sent session not found, that means the user gets deleted", 400), null);
                return;
            }
            done(null, user);
        } catch (e) {
            done(e, null);
        }
    });

    passport.use(
        new Strategy(
            {
                usernameField: "email",
            },
            async (email, password, done) => {
                try {
                    const user = await User.findOne({
                        email: email,
                    })
                        .select("+password")
                        .populate("role");
                    if (!user) {
                        return done(new AppError("email or password is incorrect", 400), false);
                    }
                    const isMatch = await bcrypt.compare(password, user.password);
                    if (!isMatch) {
                        return done(new AppError("email or password is incorrect", 400), false);
                    }
                    const doc = user.toObject({
                        transform: (doc, ret) => {
                            delete ret.password;
                            delete ret.__v;
                            return ret;
                        },
                    });
                    done(null, doc);
                } catch (e) {
                    done(e, false);
                }
            }
        )
    );
})();
