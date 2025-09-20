import { NextFunction, Request, TypedResponse } from "express";
import {
    toTreasuryExpenditureResponseDto,
    TreasuryExpenditureCreateDto,
    TreasuryExpenditureResponseDto,
} from "../../types/dtos/treasuryExpenditure.dto";
import TreasuryExpenditure from "../../models/treasuryExpenditure.model";
import { processTreasuryImage } from "../../utils/images";
import fs from "fs/promises";

const createTreasuryExpenditure = async (req: Request, res: TypedResponse<TreasuryExpenditureResponseDto>, next: NextFunction) => {
    try {
        const validatedData: TreasuryExpenditureCreateDto = req.validatedData;
        const fee = await TreasuryExpenditure.create(validatedData);

        if (req.file) {
            const file = req.file;
            const processedImage = await processTreasuryImage(
                file,
                {
                    supportsWebP: res.locals.supportsWebP,
                    isLegacyBrowser: res.locals.isLegacyBrowser,
                },
                { imageType: "expenditure", documentId: fee.serialID }
            );
            fee.image = processedImage.imageURL;
            await fee.save();
            try {
                await fs.unlink(file.path);
            } catch (e) {}
        }

        res.json({ success: true, data: toTreasuryExpenditureResponseDto(fee) });
    } catch (e) {
        next(e);
    }
};

export default createTreasuryExpenditure;
