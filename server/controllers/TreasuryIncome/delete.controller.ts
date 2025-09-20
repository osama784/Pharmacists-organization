import { NextFunction, Request, TypedResponse } from "express";
import TreasuryIncome from "../../models/treasuryIncome.model";
import { responseMessages } from "../../translation/response.ar";
import { UPLOADS_DIR } from "../../utils/images";
import path from "path";
import fs from "fs/promises";

const deleteTreasuryIncome = async (req: Request, res: TypedResponse<undefined>, next: NextFunction) => {
    try {
        const feeId = req.params.id;
        const fee = await TreasuryIncome.findOne({ serialID: feeId });
        if (!fee) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        const feeDir = path.join(UPLOADS_DIR, "incomes", feeId);
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

export default deleteTreasuryIncome;
