import { NextFunction, Request, TypedResponse } from "express";
import path from "path";
import fs from "fs/promises";
import { UPLOADS_DIR } from "../../utils/images";
import AdmZip from "adm-zip";

const downloadTreasuryExpenditureFiles = async (req: Request, res: TypedResponse<undefined>, next: NextFunction) => {
    try {
        const feeId = req.params.id;
        const feeDir = path.join(UPLOADS_DIR, "expenditures", feeId);
        const zip = new AdmZip();
        try {
            const files = await fs.readdir(feeDir);
            // Add each file to ZIP
            files.forEach((file) => {
                const filePath = path.join(feeDir, file);
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

export default downloadTreasuryExpenditureFiles;
