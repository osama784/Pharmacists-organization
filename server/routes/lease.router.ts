import { Router } from "express";
import mongoose from "mongoose";
import AppError from "../utils/AppError";
import { responseMessages } from "../translation/response.ar";
import passport from "passport";
import validate from "../middlewares/validate.middleware";
import { createLeaseZodSchema } from "../validators/lease.schema";
import createLease from "../controllers/Lease/create.controller";
import updateLicense from "../controllers/Pharmacist/licenses/updateLicense.controller";
import { updateLicenseZodSchema } from "../validators/pharmacist.schema";
import deleteLease from "../controllers/Lease/delete.controller";
import listLeases from "../controllers/Lease/list.controller";

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

router.get("/list", listLeases);
router.post("/create/:pharmacistOwnerId", validate(createLeaseZodSchema), createLease);
router.patch("/update/:id", validate(updateLicenseZodSchema), updateLicense);
router.delete("/delete/:id", deleteLease);

export default router;
