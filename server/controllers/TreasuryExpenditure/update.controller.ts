import { NextFunction, Request, TypedResponse } from "express";
import {
    toTreasuryExpenditureResponseDto,
    TreasuryExpenditureResponseDto,
    TreasuryExpenditureUpdateDto,
} from "../../types/dtos/treasuryExpenditure.dto";
import TreasuryExpenditure from "../../models/treasuryExpenditure.model";
import { responseMessages } from "../../translation/response.ar";

const updateTreasuryExpenditure = async (req: Request, res: TypedResponse<TreasuryExpenditureResponseDto>, next: NextFunction) => {
    try {
        const validatedData: TreasuryExpenditureUpdateDto = req.validatedData;
        const fee = await TreasuryExpenditure.findOne({ serialID: req.params.id });
        if (!fee) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        await fee.updateOne(validatedData);

        const doc = await TreasuryExpenditure.findById(fee.id);

        res.json({ success: true, data: toTreasuryExpenditureResponseDto(doc!) });
    } catch (e) {
        next(e);
    }
};

export default updateTreasuryExpenditure;
