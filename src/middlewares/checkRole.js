import { userRoles } from "../models/User.js";

const checkRole = (role) => (req, res, next) => {
    if (!(role in userRoles)) {
        next(new Error("provided role doesn't exist in allowed user roles"));
        return;
    }
    if (req.user?.role != role) {
        res.status(403);
        return;
    }
    next();
};

export default checkRole;
