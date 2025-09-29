import { Router } from "express";
import checkPermissions from "../middlewares/checkPermissions.middleware.js";
import permissions from "../utils/permissions.js";
import createUser from "../controllers/User/create.controller.js";
import updateUser from "../controllers/User/update.controller.js";
import deleteUser from "../controllers/User/delete.controller.js";
import validate from "../middlewares/validate.middleware.js";
import userValidationSchema, { userUpdateSchema } from "../validators/user.schema.js";
import mongoose from "mongoose";
import AppError from "../utils/AppError.js";
import listUsers from "../controllers/User/list.controller.js";
import passport from "passport";
import getUser from "../controllers/User/get.controller.js";
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

router.get("/list", checkPermissions(permissions.listUsers), listUsers);
router.get("/get/:id", checkPermissions(permissions.readUser), getUser);
router.post("/create", checkPermissions(permissions.createUser), validate(userValidationSchema), createUser);
router.patch("/update/:id", checkPermissions(permissions.updateUser), validate(userUpdateSchema), updateUser);
router.delete("/delete/:id", checkPermissions(permissions.deleteUser), deleteUser);

export default router;
