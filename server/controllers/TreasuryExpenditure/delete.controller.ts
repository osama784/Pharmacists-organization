import { NextFunction, Request, TypedResponse } from "express";
import TreasuryExpenditure from "../../models/treasuryExpenditure.model";
import { responseMessages } from "../../translation/response.ar";
import path from "path";
import fs from "fs/promises";
import { PARENT_DIR, UPLOADS_DIR } from "../../utils/images";

const deleteTreasuryExpenditure = async (req: Request, res: TypedResponse<null>, next: NextFunction) => {
    try {
        const feeId = req.params.id;
        const fee = await TreasuryExpenditure.findOne({ serialID: feeId });
        if (!fee) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        const feeDir = path.join(UPLOADS_DIR, "expenditures", feeId);
        try {
            await fs.access(feeDir);
            await fs.rm(feeDir, { force: true, recursive: true });
        } catch (e) {}

        await fee.deleteOne();

        res.sendStatus(204);
    } catch (e) {
        next(e);
    }
};

export default deleteTreasuryExpenditure;
