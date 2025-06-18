import { Router } from "express";
import listPracticeTypes from "../controllers/PracticeType/list.js";
import getPracticeTypeRelatedFees from "../controllers/PracticeType/getRelatedFees.js";
import permissions from "../utils/permissions.js";
import authenticated from "../middlewares/authenticated.js";
import checkPermission from "../middlewares/checkPermission.js";
import getRelatedFeesSchema from "../validators/PracticeTypeSchema.js";
import validate from "../middlewares/validate.js";

const router = Router();

router.get(
    "/get-related-fees",
    authenticated,
    checkPermission(permissions.listFees),
    validate(getRelatedFeesSchema),
    getPracticeTypeRelatedFees
);
router.get("/list", authenticated, checkPermission(permissions.listPracticeTypes), listPracticeTypes);

export default router;
