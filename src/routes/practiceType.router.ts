import { Router } from "express";
import passport from "passport";
import listPracticeTypes from "../controllers/PracticeType/list.controller.js";
import getPracticeTypeRelatedFees from "../controllers/PracticeType/getRelatedFees.controller.js";
import permissions from "../utils/permissions.js";
import checkPermission from "../middlewares/checkPermission.middleware.js";
import getRelatedFeesSchema from "../validators/practiceType.schema.js";
import validate from "../middlewares/validate.middleware.js";

const router = Router();
router.use(passport.authenticate("jwt", { session: false }));
router.get("/get-related-fees", checkPermission(permissions.listFees), validate(getRelatedFeesSchema), getPracticeTypeRelatedFees);
router.get("/list", checkPermission(permissions.listPracticeTypes), listPracticeTypes);

export default router;
