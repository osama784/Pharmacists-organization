import { Router } from "express";
import AppError from "../utils/AppError";
import { responseMessages } from "../translation/response.ar";
import passport from "passport";
import listTreasuryExpenditures from "../controllers/TreasuryExpenditure/list.controller";
import createTreasuryExpenditure from "../controllers/TreasuryExpenditure/create.controller";
import updateTreasuryExpenditure from "../controllers/TreasuryExpenditure/update.controller";
import deleteTreasuryExpenditure from "../controllers/TreasuryExpenditure/delete.controller";
import validate from "../middlewares/validate.middleware";
import { createTreasuryExpenditureZodSchema, updateTreasuryExpenditureZodSchema } from "../validators/treasuryExpenditure.schema";
import checkPermissions from "../middlewares/checkPermissions.middleware";
import permissions from "../utils/permissions";
import upload from "../middlewares/multer.middleware";
import downloadTreasuryExpenditureFiles from "../controllers/TreasuryExpenditure/downloadFiles.controller";

const router = Router();

router.param("id", (req, res, next, value, name) => {
    if (isNaN(Number(value))) {
        next(new AppError(responseMessages.NOT_FOUND, 400));
        return;
    }
    next();
});
router.use(passport.authenticate("jwt", { session: false }));

router.get("/list", checkPermissions(permissions.listTreasuryExpenditures), listTreasuryExpenditures);
router.post(
    "/create",
    checkPermissions(permissions.createTreasuryExpenditure),
    upload.array("files"),
    validate(createTreasuryExpenditureZodSchema),
    createTreasuryExpenditure
);
router.patch(
    "/update/:id",
    checkPermissions(permissions.updateTreasuryExpenditure),
    upload.array("files"),
    validate(updateTreasuryExpenditureZodSchema),
    updateTreasuryExpenditure
);
router.delete("/delete/:id", checkPermissions(permissions.deleteTreasuryExpenditure), deleteTreasuryExpenditure);

router.get("/download/:id", checkPermissions(permissions.downloadTreasuryExpenditureFiles), downloadTreasuryExpenditureFiles);

export default router;
