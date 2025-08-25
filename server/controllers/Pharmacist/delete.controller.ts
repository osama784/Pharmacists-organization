import Pharmacist from "../../models/pharmacist.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { responseMessages } from "../../translation/response.ar.js";
import fs from "fs/promises";
import path from "path";
import { UPLOADS_DIR } from "../../utils/images.js";
import Invoice from "../../models/invoice.model.js";

const deletePharmacist = async (req: Request, res: TypedResponse<null>, next: NextFunction) => {
    try {
        const pharmacistId = req.params.id;
        const pharmacist = await Pharmacist.findById(pharmacistId);

        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        const userDir = path.join(UPLOADS_DIR, "users", pharmacistId);
        try {
            await fs.access(userDir);
            await fs.rm(userDir, { force: true, recursive: true });
        } catch (e) {}

        await pharmacist.deleteOne();
        // delete all related invoices
        for (const invoice of pharmacist.invoices) {
            await Invoice.deleteOne({ _id: invoice });
        }

        res.sendStatus(204);
    } catch (e) {
        next(e);
    }
};

export default deletePharmacist;
