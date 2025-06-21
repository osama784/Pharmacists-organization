import { Router } from "express";
import authenticated from "../middlewares/authenticated.js";
import checkPermission from "../middlewares/checkPermission.js";
import permissions from "../utils/permissions.js";
import createUser from "../controllers/User/create.js";
import updateUser from "../controllers/User/update.js";
import deleteUser from "../controllers/User/delete.js";
import validate from "../middlewares/validate.js";
import UserSchema, { UserUpdateSchema } from "../validators/UserSchema.js";
import mongoose from "mongoose";
import AppError from "../utils/AppError.js";
import listUsers from "../controllers/User/list.js";

const router = Router();

router.param("id", (req, res, next, value, name) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        next(new AppError("invalid ID", 400));
        return;
    }
    next();
});

router.get("/list", authenticated, checkPermission(permissions.listUsers), listUsers);
router.post("/create", authenticated, checkPermission(permissions.createUser), validate(UserSchema), createUser);
router.patch("/update/:id", authenticated, checkPermission(permissions.updateUser), validate(UserUpdateSchema), updateUser);
router.delete("/delete/:id", authenticated, checkPermission(permissions.deleteUser), deleteUser);

export default router;
