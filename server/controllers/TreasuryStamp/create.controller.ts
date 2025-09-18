import { NextFunction, Request, TypedResponse } from "express";
import { toTreasuryStampResponseDto, TreasuryStampCreateDto, TreasuryStampResponseDto } from "../../types/dtos/treasuryStamp.dto";
import TreasuryStamp from "../../models/treasuryStamp.model";

const createTreasuryStamp = async (req: Request, res: TypedResponse<TreasuryStampResponseDto>, next: NextFunction) => {
    try {
        const validatedData: TreasuryStampCreateDto = req.validatedData;
        const fee = await TreasuryStamp.create(validatedData);

        res.json({ success: true, data: toTreasuryStampResponseDto(fee) });
    } catch (e) {
        next(e);
    }
};

export default createTreasuryStamp;
