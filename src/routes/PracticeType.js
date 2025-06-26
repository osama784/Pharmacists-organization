import { Router } from "express";
import passport from "passport";
import listPracticeTypes from "../controllers/PracticeType/list.js";
import getPracticeTypeRelatedFees from "../controllers/PracticeType/getRelatedFees.js";
import permissions from "../utils/permissions.js";
import checkPermission from "../middlewares/checkPermission.js";
import getRelatedFeesSchema from "../validators/PracticeTypeSchema.js";
import validate from "../middlewares/validate.js";

const router = Router();
router.use(passport.authenticate("jwt", { session: false }));
router.get("/get-related-fees", checkPermission(permissions.listFees), validate(getRelatedFeesSchema), getPracticeTypeRelatedFees);
router.get("/list", checkPermission(permissions.listPracticeTypes), listPracticeTypes);

export default router;
