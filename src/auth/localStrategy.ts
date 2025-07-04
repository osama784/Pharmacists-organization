import passport from "passport";
import { Strategy } from "passport-local";
import User, { UserStatuses } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import AppError from "../utils/AppError.js";
import { Document } from "mongoose";
import { RoleDocument } from "../types/models/role.types.js";

export default (function initPassport() {
    passport.use(
        new Strategy(
            {
                usernameField: "email",
            },
            async (email, password, done) => {
                try {
                    const user = await User.findOne({
                        email: email,
                        status: UserStatuses.active,
                    })
                        .select("+password")
                        .populate<{ role: RoleDocument }>("role");
                    if (!user) {
                        return done(new AppError("email or password is incorrect, or the user is inactive", 400), false);
                    }
                    const isMatch = await bcrypt.compare(password, user.password);
                    if (!isMatch) {
                        return done(new AppError("email or password is incorrect, or the user is inactive", 400), false);
                    }
                    const doc = user.toObject({
                        transform: (doc: Document, ret: Record<string, any>) => {
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
