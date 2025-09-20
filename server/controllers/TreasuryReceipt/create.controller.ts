import { NextFunction, Request, TypedResponse } from "express";
import { toTreasuryReceiptResponseDto, TreasuryReceiptCreateDto, TreasuryReceiptResponseDto } from "../../types/dtos/treasuryReceipt.dto";
import Pharmacist from "../../models/pharmacist.model";
import { TreasuryReceiptModelTR } from "../../translation/models.ar";
import { responseMessages } from "../../translation/response.ar";
import TreasuryReceipt from "../../models/treasuryReceipt.model";
import { PharmacistDocument } from "../../types/models/pharmacist.types";

const createTreasuryReceipt = async (req: Request, res: TypedResponse<TreasuryReceiptResponseDto>, next: NextFunction) => {
    try {
        const validatedData: TreasuryReceiptCreateDto = req.validatedData;
        const pharmacist = await Pharmacist.findById(validatedData.pharmacist);
        if (!pharmacist) {
            res.json({ success: false, details: [`${TreasuryReceiptModelTR.pharmacist}: ${responseMessages.NOT_FOUND}`] });
            return;
        }
        const total = validatedData.fees.reduce((acc, fee) => acc + fee.value, 0);
        const receipt = await (
            await TreasuryReceipt.create({ ...validatedData, total })
        ).populate<{ pharmacist: PharmacistDocument }>("pharmacist");

        res.json({ success: true, data: toTreasuryReceiptResponseDto(receipt) });
    } catch (e) {
        next(e);
    }
};

export default createTreasuryReceipt;
