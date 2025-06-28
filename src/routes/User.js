import { Router } from "express";
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
import passport from "passport";
import getUser from "../controllers/User/get.js";

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
router.get("/get/:id", checkPermission(permissions.readUser), getUser);
router.post("/create", checkPermission(permissions.createUser), validate(UserSchema), createUser);
router.patch("/update/:id", checkPermission(permissions.updateUser), validate(UserUpdateSchema), updateUser);
router.delete("/delete/:id", checkPermission(permissions.deleteUser), deleteUser);

export default router;
