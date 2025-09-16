import { NextFunction, Request, TypedResponse } from "express";
import TreasuryFee from "../../models/treasuryFee.model";
import { responseMessages } from "../../translation/response.ar";
import { toTreasuryFeeResponseDto, TreasuryFeeResponseDto } from "../../types/dtos/treasuryFee.dto";

const getTreasuryFee = async (req: Request, res: TypedResponse<TreasuryFeeResponseDto>, next: NextFunction) => {
    try {
        const fee = await TreasuryFee.findById(req.params.id);
        if (!fee) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }

        res.json({ success: true, data: toTreasuryFeeResponseDto(fee) });
    } catch (e) {
        next(e);
    }
};

export default getTreasuryFee;
