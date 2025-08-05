import { NextFunction, Request, TypedResponse } from "express";
import path from "path";
import fs from "fs/promises";
import { responseMessages } from "../../translation/response.ar";
import AdmZip from "adm-zip";

const downloadPharmacistImages = async (req: Request, res: TypedResponse<null>, next: NextFunction) => {
    try {
        const pharmacistId = req.params.id;
        const userDir = path.join(__dirname, "..", "..", "..", "..", "uploads", "users", pharmacistId);
        try {
            await fs.access(userDir);
        } catch (e) {
            res.status(200).json({ success: false, details: [responseMessages.PHARMACIST_CONTROLLERS.NO_IMAGES_FOUND] });
            return;
        }

        const zip = new AdmZip();
        const files = await fs.readdir(userDir);
        if (files.length == 0) {
            res.status(200).json({ success: false, details: [responseMessages.PHARMACIST_CONTROLLERS.NO_IMAGES_FOUND] });
            return;
        }

        // Add each file to ZIP
        files.forEach((file) => {
            const filePath = path.join(userDir, file);
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

export default downloadPharmacistImages;
