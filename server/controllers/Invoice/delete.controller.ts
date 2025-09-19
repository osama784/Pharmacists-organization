import { NextFunction, Request, TypedResponse } from "express";
import Invoice from "../../models/invoice.model.js";
import { responseMessages } from "../../translation/response.ar.js";
import path from "path";
import fs from "fs/promises";
import { UPLOADS_DIR } from "../../utils/images.js";

const deleteInvoice = async (req: Request, res: TypedResponse<null>, next: NextFunction) => {
    try {
        const invoiceId = req.params.id;
        const invoice = await Invoice.findOne({ serialID: invoiceId });
        if (!invoice) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        const invoiceDir = path.join(UPLOADS_DIR, "pharmacists", invoice.pharmacist.toString(), "invoices", invoiceId);
        try {
            await fs.access(invoiceDir);
            await fs.rm(invoiceDir, { force: true, recursive: true });
        } catch (e) {
            console.log(e);
        }

        await invoice.deleteOne();

        res.sendStatus(204);
    } catch (e) {
        next(e);
    }
};

export default deleteInvoice;
