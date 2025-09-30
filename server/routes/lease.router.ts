import { Router } from "express";
import mongoose from "mongoose";
import AppError from "../utils/AppError";
import { responseMessages } from "../translation/response.ar";
import passport from "passport";
import validate from "../middlewares/validate.middleware";
import { createLeaseZodSchema, updateLeaseZodSchema } from "../validators/lease.schema";
import createLease from "../controllers/Lease/create.controller";
import deleteLease from "../controllers/Lease/delete.controller";
import listLeases from "../controllers/Lease/list.controller";
import checkPermissions from "../middlewares/checkPermissions.middleware";
import permissions from "../utils/permissions";
import getLease from "../controllers/Lease/get.controller";
import updateLease from "../controllers/Lease/update.controller";

const router = Router();

router.param("id", (req, res, next, value, name) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        next(new AppError(responseMessages.NOT_FOUND, 400));
        return;
    }
    next();
});
router.param("pharmacistOwnerId", (req, res, next, value, name) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        next(new AppError(responseMessages.NOT_FOUND, 400));
        return;
    }
    next();
});
router.use(passport.authenticate("jwt", { session: false }));

router.get("/get", checkPermissions(permissions.getLease), getLease);
router.get("/list", checkPermissions(permissions.listLeases), listLeases);
router.post("/create", checkPermissions(permissions.createLease), validate(createLeaseZodSchema), createLease);
router.patch("/update/:id", checkPermissions(permissions.updateLease), validate(updateLeaseZodSchema), updateLease);
router.delete("/delete/:id", checkPermissions(permissions.deleteLease), deleteLease);

export default router;
