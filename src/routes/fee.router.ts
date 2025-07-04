import { Router } from "express";
import checkPermission from "../middlewares/checkPermission.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import updateFeesValues from "../controllers/Fee/updateValues.controller.js";
import listFees from "../controllers/Fee/list.controller.js";
import getFinesDate from "../controllers/Fee/getFinesDate.controller.js";
import updateFinesDate from "../controllers/Fee/updateFinesDate.controller.js";
import { updateFeesValuesSchema } from "../validators/fee.schema.js";
import permissions from "../utils/permissions.js";
import passport from "passport";

const router = Router();
router.use(passport.authenticate("jwt", { session: false }));

router.get("/fines-date", checkPermission(permissions.listFixedDates), getFinesDate);
router.patch("/fines-date", checkPermission(permissions.updateFinesDate), updateFinesDate);
router.patch("/update-values", checkPermission(permissions.updateFeesValues), validate(updateFeesValuesSchema), updateFeesValues);
router.get("/list", checkPermission(permissions.listFees), listFees);

export default router;
