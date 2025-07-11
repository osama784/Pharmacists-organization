import { Router } from "express";
import passport from "passport";
import checkPermission from "../middlewares/checkPermission.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import listRoles from "../controllers/Role/list.controller.js";
import createRole from "../controllers/Role/create.controller.js";
import deleteRole from "../controllers/Role/delete.controller.js";
import updateRole from "../controllers/Role/update.controller.js";
import listPermissions from "../controllers/Role/listPermissions.controller.js";
import RoleSchema from "../validators/role.schema.js";
import permissions from "../utils/permissions.js";
import mongoose from "mongoose";
import AppError from "../utils/AppError.js";
import getRole from "../controllers/Role/get.controller.js";
import { responseMessages } from "../translation/response.ar.js";

const router = Router();

router.param("id", (req, res, next, value, name) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        next(new AppError(responseMessages.NOT_FOUND, 400));
        return;
    }
    next();
});
router.use(passport.authenticate("jwt", { session: false }));

router.get("/get/:id", checkPermission(permissions.getRole), getRole);
router.get("/list", checkPermission(permissions.listRoles), listRoles);
router.post("/create", checkPermission(permissions.createRole), validate(RoleSchema), createRole);
router.delete("/delete/:id", checkPermission(permissions.deleteRole), deleteRole);
router.patch("/update/:id", checkPermission(permissions.updateRole), validate(RoleSchema.partial()), updateRole);
router.get("/list-permissions", checkPermission(permissions.listPermissions), listPermissions);

export default router;
