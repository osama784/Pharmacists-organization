import { NextFunction, Request, TypedResponse } from "express";
import { toTreasuryIncomeResponseDto, TreasuryIncomeCreateDto, TreasuryIncomeResponseDto } from "../../types/dtos/treasuryIncome.dto";
import TreasuryIncome from "../../models/treasuryIncome.model";
import { processTreasuryImage } from "../../utils/images";
import fs from "fs/promises";

const createTreasuryIncome = async (req: Request, res: TypedResponse<TreasuryIncomeResponseDto>, next: NextFunction) => {
    try {
        const validatedData: TreasuryIncomeCreateDto = req.validatedData;
        const fee = await TreasuryIncome.create(validatedData);

        if (req.file) {
            const file = req.file;
            const processedImage = await processTreasuryImage(
                file,
                {
                    supportsWebP: res.locals.supportsWebP,
                    isLegacyBrowser: res.locals.isLegacyBrowser,
                },
                { imageType: "income", documentId: fee.serialID }
            );
            fee.image = processedImage.imageURL;
            await fee.save();
            try {
                await fs.unlink(file.path);
            } catch (e) {}
        }

        res.json({ success: true, data: toTreasuryIncomeResponseDto(fee) });
    } catch (e) {
        next(e);
    }
};

export default createTreasuryIncome;
