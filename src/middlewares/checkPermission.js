import permissions from "../utils/permissions.js";

const checkPermission = (permission) => (req, res, next) => {
    if (!Object.values(permissions).includes(permission)) {
        next(new Error("provided permission doesn't exist in allowed user permissions"));
        return;
    }

    if (!req.user.role.permissions.includes(permission)) {
        res.sendStatus(403);
        return;
    }
    next();
};

export default checkPermission;
