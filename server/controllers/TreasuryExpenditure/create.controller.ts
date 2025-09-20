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
        const processed: string[] = [];
        if (req.files) {
            for (const file of req.files as Express.Multer.File[]) {
                const processedImage = await processTreasuryImage(
                    file,
                    {
                        supportsWebP: res.locals.supportsWebP,
                        isLegacyBrowser: res.locals.isLegacyBrowser,
                    },
                    { imageType: "expenditure", documentId: fee.serialID }
                );
                processed.push(processedImage.imageURL);
                try {
                    await fs.unlink(file.path);
                } catch (e) {}
            }
            fee.images = processed;
            await fee.save();
        }

        res.json({ success: true, data: toTreasuryExpenditureResponseDto(fee) });
    } catch (e) {
        next(e);
    }
};

export default createTreasuryExpenditure;
