import { NextFunction, Request, TypedResponse } from "express";
import { CreateTreasuryFeeDto, toTreasuryFeeResponseDto, TreasuryFeeResponseDto } from "../../types/dtos/treasuryFee.dto";
import TreasuryFee from "../../models/treasuryFee.model";
import Section from "../../models/section.model";
import { SectionDocument } from "../../types/models/section.types";

const createTreasuryFee = async (req: Request, res: TypedResponse<TreasuryFeeResponseDto>, next: NextFunction) => {
    try {
        const validatedData: CreateTreasuryFeeDto = req.validatedData;

        const section = await Section.findOne({ name: validatedData.associatedSection });

        const fee = await (
            await TreasuryFee.create({ ...validatedData, associatedSection: section })
        ).populate<{ section: SectionDocument }>("associatedSection");

        res.json({ success: true, data: toTreasuryFeeResponseDto(fee) });
    } catch (e) {
        next(e);
    }
};

export default createTreasuryFee;
