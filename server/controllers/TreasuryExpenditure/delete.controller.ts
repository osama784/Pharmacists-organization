import { NextFunction, Request, TypedResponse } from "express";
import TreasuryExpenditure from "../../models/treasuryExpenditure.model";
import { responseMessages } from "../../translation/response.ar";
import path from "path";
import fs from "fs/promises";
import { PARENT_DIR, UPLOADS_DIR } from "../../utils/images";

const deleteTreasuryExpenditure = async (req: Request, res: TypedResponse<null>, next: NextFunction) => {
    try {
        const fee = await TreasuryExpenditure.findOne({ serialID: req.params.id });
        if (!fee) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        if (fee.image) {
            const image = path.join(PARENT_DIR, fee.image);
            console.log(image);
            try {
                await fs.access(image);
                await fs.rm(image, { force: true, recursive: true });
            } catch (e) {}
        }
        await fee.deleteOne();

        res.sendStatus(204);
    } catch (e) {
        next(e);
    }
};

export default deleteTreasuryExpenditure;
