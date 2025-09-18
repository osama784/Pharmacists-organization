import { NextFunction, Request, TypedResponse } from "express";
import {
    toTreasuryExpenditureResponseDto,
    TreasuryExpenditureCreateDto,
    TreasuryExpenditureResponseDto,
} from "../../types/dtos/treasuryExpenditure.dto";
import TreasuryExpenditure from "../../models/treasuryExpenditure.model";

const createTreasuryExpenditure = async (req: Request, res: TypedResponse<TreasuryExpenditureResponseDto>, next: NextFunction) => {
    try {
        const validatedData: TreasuryExpenditureCreateDto = req.validatedData;
        const fee = await TreasuryExpenditure.create(validatedData);

        res.json({ success: true, data: toTreasuryExpenditureResponseDto(fee) });
    } catch (e) {
        next(e);
    }
};

export default createTreasuryExpenditure;
