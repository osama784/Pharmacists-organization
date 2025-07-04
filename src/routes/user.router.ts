import { Router } from "express";
import checkPermission from "../middlewares/checkPermission.middleware.js";
import permissions from "../utils/permissions.js";
import createUser from "../controllers/User/create.controller.js";
import updateUser from "../controllers/User/update.controller.js";
import deleteUser from "../controllers/User/delete.controller.js";
import validate from "../middlewares/validate.middleware.js";
import UserSchema, { UserUpdateSchema } from "../validators/user.schema.js";
import mongoose from "mongoose";
import AppError from "../utils/AppError.js";
import listUsers from "../controllers/User/list.controller.js";
import passport from "passport";

const router = Router();

router.param("id", (req, res, next, value, name) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        next(new AppError("invalid ID", 400));
        return;
    }
    next();
});
router.use(passport.authenticate("jwt", { session: false }));

router.get("/list", checkPermission(permissions.listUsers), listUsers);
router.post("/create", checkPermission(permissions.createUser), validate(UserSchema), createUser);
router.patch("/update/:id", checkPermission(permissions.updateUser), validate(UserUpdateSchema), updateUser);
router.delete("/delete/:id", checkPermission(permissions.deleteUser), deleteUser);

export default router;
