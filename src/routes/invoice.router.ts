import { Router } from "express";
import passport from "passport";
import checkPermission from "../middlewares/checkPermission.middleware.js";
import createInvoice from "../controllers/Invoice/create.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { CreateInvoiceSchema, UpdateInvoiceSchema } from "../validators/invoice.schema.js";
import mongoose from "mongoose";
import updateInvoice from "../controllers/Invoice/update.controller.js";
import listInvoices from "../controllers/Invoice/list.controller.js";
import getInvoice from "../controllers/Invoice/get.controller.js";
import permissions from "../utils/permissions.js";
import deleteInvoice from "../controllers/Invoice/delete.controller.js";
import exportInvoicesAsExcel from "../controllers/Invoice/exportExcel.controller.js";
import AppError from "../utils/AppError.js";
import { responseMessages } from "../translation/response.ar.js";

const router = Router();

router.param("id", (req, res, next, value, name) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        next(new AppError(responseMessages.NOT_FOUND, 400));
        return;
    }
    next();
});
router.param("pharmacistID", (req, res, next, value, name) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
        next(new AppError(responseMessages.NOT_FOUND, 400));
        return;
    }
    next();
});

router.use(passport.authenticate("jwt", { session: false }));

router.post("/create/:id", checkPermission(permissions.createInvoice), validate(CreateInvoiceSchema), createInvoice);
router.delete("/delete/:id", checkPermission(permissions.deleteInvoice), deleteInvoice);
router.patch("/update/:id", checkPermission(permissions.updateInvoice), validate(UpdateInvoiceSchema), updateInvoice);
router.get("/list", checkPermission(permissions.listInvoices), listInvoices);
router.get("/detail/:id", checkPermission(permissions.getInvoice), getInvoice);
router.get("/export", exportInvoicesAsExcel);

export default router;
