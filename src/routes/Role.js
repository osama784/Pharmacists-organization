import { Router } from "express";
import passport from "passport";
import checkPermission from "../middlewares/checkPermission.js";
import validate from "../middlewares/validate.js";
import listRoles from "../controllers/Role/list.js";
import createRole from "../controllers/Role/create.js";
import deleteRole from "../controllers/Role/delete.js";
import updateRole from "../controllers/Role/update.js";
import listPermissions from "../controllers/Role/listPermissions.js";
import RoleSchema from "../validators/RoleSchema.js";
import permissions from "../utils/permissions.js";
import mongoose from "mongoose";

const router = Router();

router.param("id", (req, res, next, value, name) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        next(new AppError("invalid ID", 400));
        return;
    }
    next();
});
router.use(passport.authenticate("jwt", { session: false }));

router.get("/list", checkPermission(permissions.listRoles), listRoles);
router.post("/create", checkPermission(permissions.createRole), validate(RoleSchema), createRole);
router.delete("/delete/:id", checkPermission(permissions.deleteRole), deleteRole);
router.patch("/update/:id", checkPermission(permissions.updateRole), validate(RoleSchema.partial()), updateRole);
router.get("/permissions-list", checkPermission(permissions.listPermissions), listPermissions);

export default router;
