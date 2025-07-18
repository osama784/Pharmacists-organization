import { Router } from "express";
import checkPermission from "../middlewares/checkPermission.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import updateFeesValues from "../controllers/Fee/updateValues.controller.js";
import listFees from "../controllers/Fee/list.controller.js";
import getFinesDate from "../controllers/Fee/getFinesDate.controller.js";
import updateFinesDate from "../controllers/Fee/updateFinesDate.controller.js";
import { updateDetailedPrintsSchema, updateFeesValuesSchema } from "../validators/fee.schema.js";
import permissions from "../utils/permissions.js";
import passport from "passport";
import getDetailedPrints from "../controllers/Fee/getDetailedPrints.controller.js";
import updateDetailedPrints from "../controllers/Fee/updateDetailsPrints.controller.js";
import getPharmacistRelatedFees from "../controllers/Fee/getPharmacistRelatedFees.controller.js";
import getReRegistrationDate from "../controllers/Fee/getReRegistrationDate.controller.js";
import updateReRegistrationDate from "../controllers/Fee/updateReRegistrationDate.controller.js";
import mongoose from "mongoose";
import AppError from "../utils/AppError.js";
import { responseMessages } from "../translation/response.ar.js";

const router = Router();
router.use(passport.authenticate("jwt", { session: false }));

router.param("pharmacistID", (req, res, next, value, name) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        next(new AppError(responseMessages.NOT_FOUND, 400));
        return;
    }
    next();
});

router.get("/fines-date", checkPermission(permissions.getFixedDates), getFinesDate);
router.put("/fines-date", checkPermission(permissions.updateFinesDate), updateFinesDate);
router.get("/detailed-prints", checkPermission(permissions.getDetailedPrints), getDetailedPrints);
router.put(
    "/detailed-prints",
    checkPermission(permissions.updateDetailedPrints),
    validate(updateDetailedPrintsSchema),
    updateDetailedPrints
);
router.get("/re-registration-date", checkPermission(permissions.getFixedDates), getReRegistrationDate);
router.put("/re-registration-date", checkPermission(permissions.updateReRegistrationtDate), updateReRegistrationDate);

router.patch("/update-values", checkPermission(permissions.updateFeesValues), validate(updateFeesValuesSchema), updateFeesValues);
router.get("/list", checkPermission(permissions.listFees), listFees);
router.post("/get-pharmacist-related-fees/:pharmacistID", checkPermission(permissions.listFees), getPharmacistRelatedFees);

export default router;
