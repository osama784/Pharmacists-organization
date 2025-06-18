import { Router } from "express";
import authenticated from "../middlewares/authenticated.js";
import checkPermission from "../middlewares/checkPermission.js";
import permissions from "../utils/permissions.js";
import createUser from "../controllers/User/create.js";
import updateUser from "../controllers/User/update.js";
import deleteUser from "../controllers/User/delete.js";
import createRole from "../controllers/User/createRole.js";
import deleteRole from "../controllers/User/deleteRole.js";
import assignPermissions from "../controllers/User/assignPermissions.js";
import listPermissions from "../controllers/User/listPermissions.js";
import validate from "../middlewares/validate.js";
import UserSchema, { PermissionsSchema, RoleSchema } from "../validators/UserSchema.js";
import mongoose from "mongoose";
import AppError from "../utils/AppError.js";

const router = Router();

router.param("id", (req, res, next, value, name) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        next(new AppError("invalid ID", 400));
        return;
    }
    next();
});

router.param("roleID", (req, res, next, value, name) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        next(new AppError("invalid ID", 400));
        return;
    }
    next();
});

router.get("/list-permissions", authenticated, checkPermission(permissions.listPermissions), listPermissions);

router.post("/create", authenticated, checkPermission(permissions.createUser), validate(UserSchema), createUser);
router.patch("/update/:id", authenticated, checkPermission(permissions.updateUser), validate(UserSchema.partial()), updateUser);
router.delete("/delete/:id", authenticated, checkPermission(permissions.deleteUser), deleteUser);
router.post("/create-role", authenticated, checkPermission(permissions.createRole), validate(RoleSchema), createRole);
router.delete("/delete-role/:roleID", authenticated, checkPermission(permissions.deleteRole), deleteRole);
router.patch(
    "/assign-permissions/:roleID",
    authenticated,
    checkPermission(permissions.assignPermissions),
    validate(PermissionsSchema),
    assignPermissions
);

export default router;
