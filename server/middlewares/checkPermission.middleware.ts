import { NextFunction, Request, TypedResponse } from "express";
import permissions from "../utils/permissions.js";

const checkPermission = (permission: string) => (req: Request, res: TypedResponse<null>, next: NextFunction) => {
    if (!Object.values(permissions).includes(permission)) {
        next(new Error("provided permission doesn't exist in allowed user permissions"));
        return;
    }

    if (!req.user?.role || !req.user?.role.permissions) {
        res.sendStatus(403);
        return;
    }
    if (!req.user.role.permissions.includes(permission)) {
        res.sendStatus(403);
        return;
    }
    next();
};

export default checkPermission;
