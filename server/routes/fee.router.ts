import { Router } from "express";
import checkPermissions from "../middlewares/checkPermissions.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import updateFeesValues from "../controllers/Fee/updateValues.controller.js";
import listFees from "../controllers/Fee/list.controller.js";
import getFinesDate from "../controllers/Fee/getFinesDate.controller.js";
import updateFinesDate from "../controllers/Fee/updateFinesDate.controller.js";
import { updateDetailedPrintsZodSchema, updateFeesValuesZodSchema } from "../validators/fee.schema.js";
import permissions from "../utils/permissions.js";
import passport from "passport";
import getDetailedPrints from "../controllers/Fee/getDetailedPrints.controller.js";
import updateDetailedPrints from "../controllers/Fee/updateDetailedPrints.controller.js";
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

router.get("/fines-date", checkPermissions(permissions.getFixedDates), getFinesDate);
router.put("/fines-date", checkPermissions(permissions.updateFinesDate), updateFinesDate);
router.get("/detailed-prints", checkPermissions(permissions.getDetailedPrints), getDetailedPrints);
router.put(
    "/detailed-prints",
    checkPermissions(permissions.updateDetailedPrints),
    validate(updateDetailedPrintsZodSchema),
    updateDetailedPrints
);
router.get("/re-registration-date", checkPermissions(permissions.getFixedDates), getReRegistrationDate);
router.put("/re-registration-date", checkPermissions(permissions.updateReRegistrationtDate), updateReRegistrationDate);

router.patch("/update-values", checkPermissions(permissions.updateFeesValues), validate(updateFeesValuesZodSchema), updateFeesValues);
router.get("/list", checkPermissions(permissions.listFees), listFees);

export default router;
