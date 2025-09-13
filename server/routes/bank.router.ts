import { Router } from "express";
import mongoose from "mongoose";
import { responseMessages } from "../translation/response.ar";
import AppError from "../utils/AppError";
import passport from "passport";
import checkPermissions from "../middlewares/checkPermissions.middleware";
import permissions from "../utils/permissions";
import validate from "../middlewares/validate.middleware";
import { BankCreateSchema, BankUpdateSchema } from "../validators/bank.schema";
import createBank from "../controllers/Bank/create.controller";
import listBanks from "../controllers/Bank/list.controller";
import updateBank from "../controllers/Bank/update.controller";
import deleteBank from "../controllers/Bank/delete.controller";
import getBank from "../controllers/Bank/get.controller";

const router = Router();

router.param("id", (req, res, next, value, name) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        next(new AppError(responseMessages.NOT_FOUND, 400));
        return;
    }
    next();
});
router.use(passport.authenticate("jwt", { session: false }));

router.get("/list", checkPermissions([permissions.listBanks, permissions.createInvoice, permissions.updateInvoice]), listBanks);
router.get("/get/:id", checkPermissions([permissions.listBanks, permissions.createInvoice, permissions.updateInvoice]), getBank);
router.post("/create", checkPermissions(permissions.createBank), validate(BankCreateSchema), createBank);
router.patch("/update/:id", checkPermissions(permissions.updateBank), validate(BankUpdateSchema), updateBank);
router.delete("/delete/:id", checkPermissions(permissions.deleteBank), deleteBank);

export default router;
