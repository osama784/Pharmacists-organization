import { Router } from "express";
import passport from "passport";
import checkPermissions from "../middlewares/checkPermissions.middleware.js";
import createInvoice from "../controllers/Invoice/create.controller.js";
import validate from "../middlewares/validate.middleware.js";
import { createInvoiceZodSchema, updateInvoiceZodSchema } from "../validators/invoice.schema.js";
import mongoose from "mongoose";
import updateInvoice from "../controllers/Invoice/update.controller.js";
import listInvoices from "../controllers/Invoice/list.controller.js";
import getInvoice from "../controllers/Invoice/get.controller.js";
import permissions from "../utils/permissions.js";
import deleteInvoice from "../controllers/Invoice/delete.controller.js";
import exportInvoicesAsExcel from "../controllers/Invoice/exportExcel.controller.js";
import AppError from "../utils/AppError.js";
import { responseMessages } from "../translation/response.ar.js";
import printInvoice from "../controllers/Invoice/print.controller.js";
import upload from "../middlewares/multer.middleware.js";
import downloadInvoiceImages from "../controllers/Invoice/downloadImages.controller.js";

const router = Router();

router.param("id", (req, res, next, value, name) => {
    if (isNaN(Number(value))) {
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

router.post(
    "/create/:pharmacistID",
    checkPermissions(permissions.createInvoice),
    upload.array("files"),
    validate(createInvoiceZodSchema),
    createInvoice
);
router.delete("/delete/:id", checkPermissions(permissions.deleteInvoice), deleteInvoice);
router.patch(
    "/update/:id",
    upload.array("files"),
    checkPermissions(permissions.updateInvoice),
    validate(updateInvoiceZodSchema),
    updateInvoice
);
router.get("/list", checkPermissions(permissions.listInvoices), listInvoices);
router.get("/detail/:id", checkPermissions(permissions.getInvoice), getInvoice);
router.get("/export", checkPermissions(permissions.exportInvoicesAsExcel), exportInvoicesAsExcel);
router.get("/print/:id", checkPermissions(permissions.printInvoice), printInvoice);
router.get("/download/:id", checkPermissions(permissions.downloadInvoiceImages), downloadInvoiceImages);

export default router;
