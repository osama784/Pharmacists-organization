import { Router } from "express";
import AppError from "../utils/AppError";
import { responseMessages } from "../translation/response.ar";
import passport from "passport";
import listTreasuryIncomes from "../controllers/TreasuryIncome/list.controller";
import createTreasuryIncome from "../controllers/TreasuryIncome/create.controller";
import updateTreasuryIncome from "../controllers/TreasuryIncome/update.controller";
import deleteTreasuryIncome from "../controllers/TreasuryIncome/delete.controller";
import validate from "../middlewares/validate.middleware";
import { TreasuryIncomeCreateSchema, TreasuryIncomeUpdateSchema } from "../validators/treasuryIncome.schema";
import checkPermissions from "../middlewares/checkPermissions.middleware";
import permissions from "../utils/permissions";
import upload from "../middlewares/multer.middleware";

const router = Router();

router.param("id", (req, res, next, value, name) => {
    if (isNaN(Number(value))) {
        next(new AppError(responseMessages.NOT_FOUND, 400));
        return;
    }
    next();
});
router.use(passport.authenticate("jwt", { session: false }));

router.get("/list", checkPermissions(permissions.listTreasuryIncomes), listTreasuryIncomes);
router.post(
    "/create",
    checkPermissions(permissions.createTreasuryIncome),
    upload.single("file"),
    validate(TreasuryIncomeCreateSchema),
    createTreasuryIncome
);
router.patch(
    "/update/:id",
    checkPermissions(permissions.updateTreasuryIncome),
    upload.single("file"),
    validate(TreasuryIncomeUpdateSchema),
    updateTreasuryIncome
);
router.delete("/delete/:id", checkPermissions(permissions.deleteTreasuryIncome), deleteTreasuryIncome);

export default router;
