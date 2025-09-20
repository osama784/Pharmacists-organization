import { NextFunction, Request, TypedResponse } from "express";
import { responseMessages } from "../../translation/response.ar";
import TreasuryReceipt from "../../models/treasuryReceipt.model";

const deleteTreasuryReceipt = async (req: Request, res: TypedResponse<undefined>, next: NextFunction) => {
    try {
        const receiptID = req.params.id;
        const receipt = await TreasuryReceipt.findOne({ serialID: receiptID });
        if (!receipt) {
            res.json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }

        await receipt.deleteOne();

        res.sendStatus(204);
    } catch (e) {
        next(e);
    }
};

export default deleteTreasuryReceipt;
