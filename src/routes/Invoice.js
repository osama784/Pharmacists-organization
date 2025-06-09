import { Router } from "express";
import authenticated from "../middlewares/authenticated.js";
import checkRole from "../middlewares/checkRole.js";
import createInvoice from "../controllers/Invoice/create.js";
import updateInvoice from "../controllers/Invoice/update.js";
import validate from "../middlewares/validate";
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

router.post("/create/:pharmacistID", authenticated, checkRole(permissions.createInvoice), validate(InvoiceSchema.partial()), createInvoice);
router.patch("/update/:id", authenticated, checkRole(permissions.updateInvoice), validate(InvoiceUpdateFeesSchema), updateInvoice);
router.delete("/delete/:id", authenticated, checkRole(permissions.deleteInvoice), deleteInvoice);
router.patch("/change-status/:id", authenticated, checkRole(permissions.changeInvoiceStatus), changeInvoiceStatus);
router.get("/list", authenticated, checkRole(permissions.listInvoices), listInvoices);
router.get("/detail/:id", authenticated, checkRole(permissions.getInvoice), getInvoice);

export default router;
