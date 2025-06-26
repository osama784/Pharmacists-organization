import { Router } from "express";
import passport from "passport";
import checkPermission from "../middlewares/checkPermission.js";
import createInvoice from "../controllers/Invoice/create.js";
import validate from "../middlewares/validate.js";
import InvoiceSchema from "../validators/InvoiceSchema.js";
import mongoose from "mongoose";
import updateInvoiceStatus from "../controllers/Invoice/updateStatus.js";
import listInvoices from "../controllers/Invoice/list.js";
import getInvoice from "../controllers/Invoice/get.js";
import permissions from "../utils/permissions.js";
import deleteInvoice from "../controllers/Invoice/delete.js";
import exportInvoicesAsExcel from "../controllers/Invoice/exportExcel.js";

const router = Router();

router.param("id", (req, res, next, value, name) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        next(new AppError("invalid ID", 400));
        return;
    }
    next();
});
router.param("pharmacistID", (req, res, next, value, name) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        next(new AppError("invalid ID", 400));
        return;
    }
    next();
});

router.use(passport.authenticate("jwt", { session: false }));

router.post("/create/:id", checkPermission(permissions.createInvoice), validate(InvoiceSchema), createInvoice);
router.delete("/delete/:id", checkPermission(permissions.deleteInvoice), deleteInvoice);
router.patch("/update-status/:id", checkPermission(permissions.updateInvoiceStatus), updateInvoiceStatus);
router.get("/list", checkPermission(permissions.listInvoices), listInvoices);
router.get("/detail/:id", checkPermission(permissions.getInvoice), getInvoice);
router.get("/export", exportInvoicesAsExcel);

export default router;
