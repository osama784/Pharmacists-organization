import { NextFunction, Request, TypedResponse } from "express";
import { toTreasuryIncomeResponseDto, TreasuryIncomeResponseDto, TreasuryIncomeUpdateDto } from "../../types/dtos/treasuryIncome.dto";
import TreasuryIncome from "../../models/treasuryIncome.model";
import { responseMessages } from "../../translation/response.ar";

const updateTreasuryIncome = async (req: Request, res: TypedResponse<TreasuryIncomeResponseDto>, next: NextFunction) => {
    try {
        const validatedData: TreasuryIncomeUpdateDto = req.validatedData;
        const fee = await TreasuryIncome.findOne({ serialID: req.params.id });
        if (!fee) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        await fee.updateOne(validatedData);

        const doc = await TreasuryIncome.findById(fee.id);

        res.json({ success: true, data: toTreasuryIncomeResponseDto(doc!) });
    } catch (e) {
        next(e);
    }
};

export default updateTreasuryIncome;
