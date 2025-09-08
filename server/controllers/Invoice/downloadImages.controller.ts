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
        const zip = new AdmZip();
        try {
            const files = await fs.readdir(invoiceDir);
            // Add each file to ZIP
            files.forEach((file) => {
                const filePath = path.join(invoiceDir, file);
                zip.addLocalFile(filePath);
            });
        } catch (e) {
            // so folder doesn't exist
        }

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
