import { NextFunction, Request, TypedResponse } from "express";
import path from "path";
import fs from "fs/promises";
import { responseMessages } from "../../translation/response.ar";
import AdmZip from "adm-zip";
import { UPLOADS_DIR } from "../../utils/images";
import Invoice from "../../models/invoice.model";

const downloadInvoiceImages = async (req: Request, res: TypedResponse<null>, next: NextFunction) => {
    try {
        const invoiceId = req.params.id;
        const invoice = await Invoice.findOne({ serialID: invoiceId });
        if (!invoice) {
            res.json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        const invoiceDir = path.join(UPLOADS_DIR, "pharmacists", invoice.pharmacist.toString(), "invoices", invoiceId);
        try {
            await fs.access(invoiceDir);
        } catch (e) {
            res.status(200).json({ success: false, details: [responseMessages.INVOICE_CONTROLLERS.NO_IMAGES_FOUND] });
            return;
        }

        const zip = new AdmZip();
        const files = await fs.readdir(invoiceDir);
        if (files.length == 0) {
            res.status(400).json({ success: false, details: [responseMessages.INVOICE_CONTROLLERS.NO_IMAGES_FOUND] });
            return;
        }

        // Add each file to ZIP
        files.forEach((file) => {
            const filePath = path.join(invoiceDir, file);
            zip.addLocalFile(filePath);
        });

        // Get ZIP buffer
        const zipBuffer = zip.toBuffer();
        const zipFileName = `${Date.now()}.zip`;

        // Send to client
        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", `attachment; filename="${zipFileName}"`);
        res.setHeader("Content-Length", zipBuffer.length);
        res.send(zipBuffer);
    } catch (e) {
        next(e);
    }
};

export default downloadInvoiceImages;
