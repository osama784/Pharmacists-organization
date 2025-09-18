import { NextFunction, Request, TypedResponse } from "express";
import { toTreasuryStampResponseDto, TreasuryStampResponseDto, TreasuryStampUpdateDto } from "../../types/dtos/treasuryStamp.dto";
import TreasuryStamp from "../../models/treasuryStamp.model";
import { responseMessages } from "../../translation/response.ar";

const updateTreasuryStamp = async (req: Request, res: TypedResponse<TreasuryStampResponseDto>, next: NextFunction) => {
    try {
        const validatedData: TreasuryStampUpdateDto = req.validatedData;
        const fee = await TreasuryStamp.findOne({ serialID: req.params.id });
        if (!fee) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        await fee.updateOne(validatedData);

        const doc = await TreasuryStamp.findById(fee.id);

        res.json({ success: true, data: toTreasuryStampResponseDto(doc!) });
    } catch (e) {
        next(e);
    }
};

export default updateTreasuryStamp;
