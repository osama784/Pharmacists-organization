import { Router } from "express";
import checkPermission from "../middlewares/checkPermission.js";
import validate from "../middlewares/validate.js";
import updateFeesValues from "../controllers/Fee/updateValues.js";
import listFees from "../controllers/Fee/list.js";
import getFinesDate from "../controllers/Fee/getFinesDate.js";
import updateFinesDate from "../controllers/Fee/updateFinesDate.js";
import { updateFeesValuesSchema } from "../validators/FeeSchema.js";
import permissions from "../utils/permissions.js";
import passport from "passport";

const router = Router();
router.use(passport.authenticate("jwt", { session: false }));

router.get("/fines-date", checkPermission(permissions.listFixedDates), getFinesDate);
router.patch("/fines-date", checkPermission(permissions.updateFinesDate), updateFinesDate);
router.patch("/update-values", checkPermission(permissions.updateFeesValues), validate(updateFeesValuesSchema), updateFeesValues);
router.get("/list", checkPermission(permissions.listFees), listFees);

export default router;
