import { Router } from "express";
import passport from "passport";
import validate from "../middlewares/validate.middleware.js";
import createPharmacist from "../controllers/Pharmacist/create.controller.js";
import checkPermission from "../middlewares/checkPermission.middleware.js";
import listPharmacists from "../controllers/Pharmacist/list.controller.js";
import updatePharmacist from "../controllers/Pharmacist/update.controller.js";
import deletePharmacist from "../controllers/Pharmacist/delete.controller.js";
import mongoose from "mongoose";
import AppError from "../utils/AppError.js";
import permissions from "../utils/permissions.js";
import PharmacistSchema from "../validators/pharmacist.schema.js";
import getPharmacist from "../controllers/Pharmacist/get.controller.js";
import exportPharmacistsAsExcel from "../controllers/Pharmacist/exportExcel.controller.js";

const router = Router();
router.param("id", (req, res, next, value, name) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        next(new AppError(undefined, 404));
        return;
    }
    next();
});

router.param("recordID", (req, res, next, value, name) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        next(new AppError(undefined, 404));
        return;
    }
    next();
});
router.use(passport.authenticate("jwt", { session: false }));

router.get("/list", checkPermission(permissions.listPharmacists), listPharmacists);
router.get("/detail/:id", checkPermission(permissions.getPharmacist), getPharmacist);
router.get("/export", exportPharmacistsAsExcel);
router.post("/create", checkPermission(permissions.createPharmacist), validate(PharmacistSchema), createPharmacist);
router.patch("/update/:id", checkPermission(permissions.updatePharmacist), validate(PharmacistSchema.partial()), updatePharmacist);
router.delete("/delete/:id", checkPermission(permissions.deletePharmacist), deletePharmacist);

export default router;
