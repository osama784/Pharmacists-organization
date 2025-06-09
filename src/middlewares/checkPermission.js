import permissions from "../utils/permissions.js";

const checkPermission = (permission) => (req, res, next) => {
    if (!(permission in Object.values(permissions))) {
        next(new Error("provided role doesn't exist in allowed user roles"));
        return;
    }
    if (!(permission in req.user.role.permissions)) {
        res.status(403);
        return;
    }
    next();
};

export default checkPermission;
