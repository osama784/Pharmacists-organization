import { Router } from "express";
import authenticated from "../middlewares/authenticated.js";
import checkPermission from "../middlewares/checkPermission.js";
import createInvoice from "../controllers/Invoice/create.js";
import updateInvoice from "../controllers/Invoice/update.js";
import validate from "../middlewares/validate.js";
import InvoiceSchema, { InvoiceUpdateFeesSchema } from "../validators/InvoiceSchema.js";
import mongoose from "mongoose";
import changeInvoiceStatus from "../controllers/Invoice/changeStatus.js";
import listInvoices from "../controllers/Invoice/list.js";
import getInvoice from "../controllers/Invoice/get.js";
import permissions from "../utils/permissions.js";
import deleteInvoice from "../controllers/Invoice/delete.js";

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

router.post("/create/:pharmacistID", authenticated, checkPermission(permissions.createInvoice), validate(InvoiceSchema), createInvoice);
router.patch("/update/:id", authenticated, checkPermission(permissions.updateInvoice), validate(InvoiceUpdateFeesSchema), updateInvoice);
router.delete("/delete/:id", authenticated, checkPermission(permissions.deleteInvoice), deleteInvoice);
router.patch("/change-status/:id", authenticated, checkPermission(permissions.changeInvoiceStatus), changeInvoiceStatus);
router.get("/list", authenticated, checkPermission(permissions.listInvoices), listInvoices);
router.get("/detail/:id", authenticated, checkPermission(permissions.getInvoice), getInvoice);

export default router;
