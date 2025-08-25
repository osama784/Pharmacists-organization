import { ReadablePermissions } from "../../utils/permissions.js";
import { NextFunction, Request, TypedResponse } from "express";

const listPermissions = (req: Request, res: TypedResponse<Record<string, string[]>>, next: NextFunction) => {
    res.json({ success: true, data: ReadablePermissions });
};

export default listPermissions;
