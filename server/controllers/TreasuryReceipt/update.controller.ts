import { NextFunction, Request, TypedResponse } from "express";
import { toTreasuryReceiptResponseDto, TreasuryReceiptUpdateDto, TreasuryReceiptResponseDto } from "../../types/dtos/treasuryReceipt.dto";
import Pharmacist from "../../models/pharmacist.model";
import { TreasuryReceiptModelTR } from "../../translation/models.ar";
import { responseMessages } from "../../translation/response.ar";
import TreasuryReceipt from "../../models/treasuryReceipt.model";
import { PharmacistDocument } from "../../types/models/pharmacist.types";

const updateTreasuryReceipt = async (req: Request, res: TypedResponse<TreasuryReceiptResponseDto>, next: NextFunction) => {
    try {
        const receiptID = req.params.id;
        const validatedData: TreasuryReceiptUpdateDto = req.validatedData;
        const receipt = await TreasuryReceipt.findOne({ serialID: receiptID });
        if (!receipt) {
            res.json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        if (validatedData.pharmacist) {
            const pharmacist = await Pharmacist.findById(validatedData.pharmacist);
            if (!pharmacist) {
                res.json({ success: false, details: [`${TreasuryReceiptModelTR.pharmacist}: ${responseMessages.NOT_FOUND}`] });
                return;
            }
        }
        let total = receipt.total;
        if (validatedData.fees) {
            total = validatedData.fees.reduce((acc, fee) => acc + fee.value, 0);
        }

        await receipt.updateOne({ ...validatedData, total });

        const doc = await TreasuryReceipt.findById(receipt.id).populate<{ pharmacist: PharmacistDocument }>("pharmacist");

        res.json({ success: true, data: toTreasuryReceiptResponseDto(doc!) });
    } catch (e) {
        next(e);
    }
};

export default updateTreasuryReceipt;
