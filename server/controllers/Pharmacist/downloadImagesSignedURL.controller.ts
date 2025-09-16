import { NextFunction, Request, TypedResponse } from "express";
import path from "path";
import fs from "fs/promises";
import { responseMessages } from "../../translation/response.ar";
import AdmZip from "adm-zip";
import { UPLOADS_DIR } from "../../utils/images";
import Pharmacist from "../../models/pharmacist.model";

const downloadPharmacistImagesSignedURL = async (req: Request, res: TypedResponse<null>, next: NextFunction) => {
    try {
        const pharmacistId = req.params.id;
        const folderToken = req.params.folderToken;
        const pharmacist = await Pharmacist.findById(pharmacistId);
        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        if (pharmacist.folderToken != folderToken) {
            res.status(400).json({ success: false, details: [responseMessages.FORBIDDEN] });
            return;
        }
        const pharmacistDir = path.join(UPLOADS_DIR, "pharmacists", pharmacistId, "personal");
        const zip = new AdmZip();
        try {
            const files = await fs.readdir(pharmacistDir);
            // Add each file to ZIP
            files.forEach((file) => {
                const filePath = path.join(pharmacistDir, file);
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

export default downloadPharmacistImagesSignedURL;
