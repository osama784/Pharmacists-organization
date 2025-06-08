import { Router } from "express";
import authenticated from "../middlewares/authenticated";
import checkRole from "../middlewares/checkRole";
import createInvoice from "../controllers/Invoice/create";
import updateInvoice from "../controllers/Invoice/update";
import validate from "../middlewares/validate";
import InvoiceSchema, { InvoiceUpdateFeesSchema } from "../validators/InvoiceSchema";
import mongoose from "mongoose";
import changeInvoiceStatus from "../controllers/Invoice/changeStatus";
import listInvoices from "../controllers/Invoice/list";
import getInvoice from "../controllers/Invoice/get";

const router = Router();

router.param("id", (req, res, next, value, name) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        next(new AppError("invalid ID", 400));
        return;
    }
    next();
});

router.post("/create", authenticated, checkRole(""), validate(InvoiceSchema.partial()), createInvoice);
router.patch("/update/:id", authenticated, checkRole(""), validate(InvoiceUpdateFeesSchema), updateInvoice);
router.patch("/change-status/:id", authenticated, checkRole(""), changeInvoiceStatus);
router.get("/list", authenticated, checkRole(""), listInvoices);
router.get("/detail/:id", authenticated, checkRole(""), getInvoice);
