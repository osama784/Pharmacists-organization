import { NextFunction, Request, TypedResponse } from "express";
import { toTreasuryReceiptResponseDto, TreasuryReceiptResponseDto } from "../../types/dtos/treasuryReceipt.dto";
import { responseMessages } from "../../translation/response.ar";
import TreasuryReceipt from "../../models/treasuryReceipt.model";
import { PharmacistDocument } from "../../types/models/pharmacist.types";

const getTreasuryReceipt = async (req: Request, res: TypedResponse<TreasuryReceiptResponseDto>, next: NextFunction) => {
    try {
        const receiptID = req.params.id;
        const receipt = await TreasuryReceipt.findOne({ serialID: receiptID }).populate<{ pharmacist: PharmacistDocument }>("pharmacist");
        if (!receipt) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }

        res.json({ success: true, data: toTreasuryReceiptResponseDto(receipt) });
    } catch (e) {
        next(e);
    }
};

export default getTreasuryReceipt;
