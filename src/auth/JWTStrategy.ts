import { ExtractJwt, StrategyOptions } from "passport-jwt";
import { Strategy as JwtStrategy } from "passport-jwt";
import User from "../models/User.js";
import passport from "passport";
import jwt from "jsonwebtoken";

const jwtOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET!,
};

export default (function initPassport() {
    passport.use(
        new JwtStrategy(jwtOptions, async (payload, done) => {
            try {
                const user = await User.findById(payload.sub).populate("role");
                if (!user) {
                    done(null, false);
                    return;
                }
                return done(null, user);
            } catch (error) {
                return done(error, false);
            }
        })
    );
})();

// Generate JWT token
export const generateToken = (user) => {
    return jwt.sign({ sub: user.id, iat: Date.now() }, process.env.JWT_SECRET!);
};
