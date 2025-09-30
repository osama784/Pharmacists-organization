import { Router } from "express";
import passport from "passport";
import checkPermissions from "../middlewares/checkPermissions.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import listRoles from "../controllers/Role/list.controller.js";
import createRole from "../controllers/Role/create.controller.js";
import deleteRole from "../controllers/Role/delete.controller.js";
import updateRole from "../controllers/Role/update.controller.js";
import roleZodSchema from "../validators/role.schema.js";
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

router.get("/get/:id", checkPermissions(permissions.getRole), getRole);
router.get("/list", checkPermissions(permissions.listRoles), listRoles);
router.post("/create", checkPermissions(permissions.createRole), validate(roleZodSchema), createRole);
router.delete("/delete/:id", checkPermissions(permissions.deleteRole), deleteRole);
router.patch("/update/:id", checkPermissions(permissions.updateRole), validate(roleZodSchema.partial()), updateRole);

export default router;
