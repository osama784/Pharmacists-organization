import { Router } from "express";
import authenticated from "../middlewares/authenticated.js";
import checkPermission from "../middlewares/checkPermission.js";
import validate from "../middlewares/validate.js";
import updateFeesValues from "../controllers/Fee/updateValues.js";
import listFees from "../controllers/Fee/list.js";
import getFinesDate from "../controllers/Fee/getFinesDate.js";
import updateFinesDate from "../controllers/Fee/updateFinesDate.js";
import { updateFeesValuesSchema } from "../validators/FeeSchema.js";
import permissions from "../utils/permissions.js";

const router = Router();

router.get("/fines-date", authenticated, checkPermission(permissions.listFixedDates), getFinesDate);
router.patch("/fines-date", authenticated, checkPermission(permissions.updateFinesDate), updateFinesDate);
router.patch(
    "/update-values",
    authenticated,
    checkPermission(permissions.updateFeesValues),
    validate(updateFeesValuesSchema),
    updateFeesValues
);
router.get("/list", authenticated, checkPermission(permissions.listFees), listFees);

export default router;
