import { Router } from "express";
import authenticated from "../middlewares/authenticated.js";
import checkPermission from "../middlewares/checkPermission.js";
import validate from "../middlewares/validate.js";
import changeFeesValues from "../controllers/Fee/changeValues.js";
import listFees from "../controllers/Fee/list.js";
import { FeesChangeValuesSchema } from "../validators/FeeSchema.js";
import permissions from "../utils/permissions.js";

const router = Router();

router.patch(
    "/change-values",
    authenticated,
    checkPermission(permissions.changeFeesValues),
    validate(FeesChangeValuesSchema),
    changeFeesValues
);
router.get("/list", authenticated, checkPermission(permissions.listFees), listFees);

export default router;
