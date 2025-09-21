import { Router } from "express";
import passport from "passport";
import createTreasuryReceipt from "../controllers/TreasuryReceipt/create.controller";
import validate from "../middlewares/validate.middleware";
import { TreasuryReceiptCreateSchema, TreasuryReceiptUpdateSchema } from "../validators/treasuryReceipt.schema";
import updateTreasuryReceipt from "../controllers/TreasuryReceipt/update.controller";
import deleteTreasuryReceipt from "../controllers/TreasuryReceipt/delete.controller";
import listTreasuryReceipts from "../controllers/TreasuryReceipt/list.controller";
import getTreasuryReceipt from "../controllers/TreasuryReceipt/get.controller";
import checkPermissions from "../middlewares/checkPermissions.middleware";
import permissions from "../utils/permissions";
import printTreasuryReceipt from "../controllers/TreasuryReceipt/print.controller";

const router = Router();

router.use(passport.authenticate("jwt", { session: false }));

router.get("/list", listTreasuryReceipts);
router.get("/get/:id", checkPermissions(permissions.getTreasuryReceipt), getTreasuryReceipt);
router.post("/create", checkPermissions(permissions.createTreasuryReceipt), validate(TreasuryReceiptCreateSchema), createTreasuryReceipt);
router.patch(
    "/update/:id",
    checkPermissions(permissions.updateTreasuryReceipt),
    validate(TreasuryReceiptUpdateSchema),
    updateTreasuryReceipt
);
router.delete("/delete/:id", checkPermissions(permissions.deleteTreasuryReceipt), deleteTreasuryReceipt);

router.get("/print/:id", checkPermissions(permissions.printTreasuryReceipt), printTreasuryReceipt);

export default router;
