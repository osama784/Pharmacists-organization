import { Router } from "express";
import validate from "../middlewares/validate.js";
import authenticated from "../middlewares/authenticated.js";
import createPharmacist from "../controllers/Pharmacist/create.js";
import checkPermission from "../middlewares/checkPermission.js";
import listPharmacists from "../controllers/Pharmacist/list.js";
import updatePharmacist from "../controllers/Pharmacist/update.js";
import deletePharmacist from "../controllers/Pharmacist/delete.js";
import mongoose from "mongoose";
import AppError from "../utils/AppError.js";
import permissions from "../utils/permissions.js";

const router = Router();
router.param("id", (req, res, next, value, name) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        next(new AppError("invalid ID", 400));
        return;
    }
    next();
});

router.param("recordID", (req, res, next, value, name) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        next(new AppError("invalid ID", 400));
        return;
    }
    next();
});

router.get("/list", authenticated, checkPermission(permissions.listPharmacists), listPharmacists);
router.post(
    "/create",
    authenticated,
    checkPermission(permissions.createPharmacist),
    validate(PharmacistSchema.partial()),
    createPharmacist
);
router.patch("/update/:id", authenticated, checkPermission(permissions.updatePharmacist), validate(PharmacistSchema), updatePharmacist);
router.delete("/delete/:id", authenticated, checkPermission(permissions.deletePharmacist), deletePharmacist);

export default router;
