import { NextFunction, Request, TypedResponse } from "express";
import { toTreasuryIncomeResponseDto, TreasuryIncomeCreateDto, TreasuryIncomeResponseDto } from "../../types/dtos/treasuryIncome.dto";
import TreasuryIncome from "../../models/treasuryIncome.model";

const createTreasuryIncome = async (req: Request, res: TypedResponse<TreasuryIncomeResponseDto>, next: NextFunction) => {
    try {
        const validatedData: TreasuryIncomeCreateDto = req.validatedData;
        const fee = await TreasuryIncome.create(validatedData);

        res.json({ success: true, data: toTreasuryIncomeResponseDto(fee) });
    } catch (e) {
        next(e);
    }
};

export default createTreasuryIncome;
