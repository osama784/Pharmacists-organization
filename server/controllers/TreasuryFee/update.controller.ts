import { NextFunction, Request, TypedResponse } from "express";
import {
    CreateTreasuryFeeDto,
    toTreasuryFeeResponseDto,
    TreasuryFeeResponseDto,
    UpdateTreasuryFeeDto,
} from "../../types/dtos/treasuryFee.dto";
import TreasuryFee from "../../models/treasuryFee.model";
import Section from "../../models/section.model";
import { responseMessages } from "../../translation/response.ar";
import { TreasuryFeeTR } from "../../translation/models.ar";
import { SectionDocument } from "../../types/models/section.types";

const updateTreasuryFee = async (req: Request, res: TypedResponse<TreasuryFeeResponseDto>, next: NextFunction) => {
    try {
        const feeID = req.params.id;
        const validatedData: UpdateTreasuryFeeDto = req.validatedData;
        let updatedFields = validatedData;

        const fee = await TreasuryFee.findById(feeID);
        if (!fee) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        if (validatedData.associatedSection != undefined) {
            const section = await Section.findOne({ name: validatedData.associatedSection });
            updatedFields = { ...validatedData, associatedSection: section!.id };
        }

        await fee.updateOne(updatedFields);

        const doc = await TreasuryFee.findById(feeID).populate<{ section: SectionDocument }>("associatedSection");

        res.json({ success: true, data: toTreasuryFeeResponseDto(doc!) });
    } catch (e) {
        next(e);
    }
};

export default updateTreasuryFee;
