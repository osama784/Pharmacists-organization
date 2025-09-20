import { Router } from "express";
import mongoose from "mongoose";
import AppError from "../utils/AppError";
import { responseMessages } from "../translation/response.ar";
import passport from "passport";
import createTreasuryReceipt from "../controllers/TreasuryReceipt/create.controller";
import validate from "../middlewares/validate.middleware";
import { TreasuryReceiptCreateSchema, TreasuryReceiptUpdateSchema } from "../validators/treasuryReceipt.schema";
import updateTreasuryReceipt from "../controllers/TreasuryReceipt/update.controller";
import deleteTreasuryReceipt from "../controllers/TreasuryReceipt/delete.controller";
import listTreasuryReceipts from "../controllers/TreasuryReceipt/list.controller";
import getTreasuryReceipt from "../controllers/TreasuryReceipt/get.controller";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.get("/list", listTreasuryReceipts);
router.get("/get/:id", getTreasuryReceipt);
router.post("/create", validate(TreasuryReceiptCreateSchema), createTreasuryReceipt);
router.patch("/update/:id", validate(TreasuryReceiptUpdateSchema), updateTreasuryReceipt);
router.delete("/delete/:id", deleteTreasuryReceipt);

export default router;
