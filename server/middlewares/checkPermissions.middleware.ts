import { NextFunction, Request, TypedResponse } from "express";
import permissions from "../utils/permissions.js";

const checkPermissions = (values: string | string[]) => (req: Request, res: TypedResponse<null>, next: NextFunction) => {
    if (!req.user?.role || !req.user?.role.permissions) {
        res.sendStatus(403);
        return;
    }
    if (Array.isArray(values)) {
        let allowed = false;
        for (const permission of values) {
            if (!Object.values(permissions).includes(permission)) {
                next(new Error("provided permission doesn't exist in allowed user permissions"));
                return;
            }
            if (req.user.role.permissions.includes(permission)) {
                allowed = true;
            }
        }
        if (!allowed) {
            res.sendStatus(403);
            return;
        }
    } else {
        if (!Object.values(permissions).includes(values)) {
            next(new Error("provided permission doesn't exist in allowed user permissions"));
            return;
        }
        if (!req.user.role.permissions.includes(values)) {
            res.sendStatus(403);
            return;
        }
    }

    next();
};

export default checkPermissions;
