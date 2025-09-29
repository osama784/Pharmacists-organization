import { Router } from "express";
import mongoose from "mongoose";
import AppError from "../utils/AppError";
import { responseMessages } from "../translation/response.ar";
import passport from "passport";
import checkPermissions from "../middlewares/checkPermissions.middleware";
import createTreasuryFee from "../controllers/TreasuryFee/create.controller";
import validate from "../middlewares/validate.middleware";
import { createTreasuryFeeZodSchema, updateTreasuryFeeZodSchema } from "../validators/treasuryFee.schema";
import deleteTreasuryFee from "../controllers/TreasuryFee/delete.controller";
import updateTreasuryFee from "../controllers/TreasuryFee/update.controller";
import permissions from "../utils/permissions";
import listTreasuryFees from "../controllers/TreasuryFee/list.controller";
import getTreasuryFee from "../controllers/TreasuryFee/get.controller";

const router = Router();

router.param("id", (req, res, next, value, name) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        next(new AppError(responseMessages.NOT_FOUND, 400));
        return;
    }
    next();
});
router.use(passport.authenticate("jwt", { session: false }));

router.get("/list", checkPermissions(permissions.listTreasuryFees), listTreasuryFees);
router.get("/get/:id", checkPermissions(permissions.getTreasuryFee), getTreasuryFee);
router.post("/create", checkPermissions(permissions.createTreasuryFee), validate(createTreasuryFeeZodSchema), createTreasuryFee);
router.patch("/update/:id", checkPermissions(permissions.updateTreasuryFee), validate(updateTreasuryFeeZodSchema), updateTreasuryFee);
router.delete("/delete/:id", checkPermissions(permissions.deleteTreasuryFee), deleteTreasuryFee);

export default router;
