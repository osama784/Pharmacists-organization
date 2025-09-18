import { Router } from "express";
import AppError from "../utils/AppError";
import { responseMessages } from "../translation/response.ar";
import passport from "passport";
import listTreasuryStamps from "../controllers/TreasuryStamp/list.controller";
import createTreasuryStamp from "../controllers/TreasuryStamp/create.controller";
import updateTreasuryStamp from "../controllers/TreasuryStamp/update.controller";
import deleteTreasuryStamp from "../controllers/TreasuryStamp/delete.controller";
import validate from "../middlewares/validate.middleware";
import { TreasuryStampCreateSchema, TreasuryStampUpdateSchema } from "../validators/treasuryStamp.schema";
import checkPermissions from "../middlewares/checkPermissions.middleware";
import permissions from "../utils/permissions";

const router = Router();

router.param("id", (req, res, next, value, name) => {
    if (isNaN(Number(value))) {
        next(new AppError(responseMessages.NOT_FOUND, 400));
        return;
    }
    next();
});
router.use(passport.authenticate("jwt", { session: false }));

router.get("/list", checkPermissions(permissions.listTreasuryStamps), listTreasuryStamps);
router.post("/create", checkPermissions(permissions.createTreasuryStamp), validate(TreasuryStampCreateSchema), createTreasuryStamp);
router.patch("/update/:id", checkPermissions(permissions.updateTreasuryStamp), validate(TreasuryStampUpdateSchema), updateTreasuryStamp);
router.delete("/delete/:id", checkPermissions(permissions.deleteTreasuryStamp), deleteTreasuryStamp);

export default router;
