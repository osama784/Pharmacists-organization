import { NextFunction, Request, TypedResponse } from "express";
import { toTreasuryIncomeResponseDto, TreasuryIncomeCreateDto, TreasuryIncomeResponseDto } from "../../types/dtos/treasuryIncome.dto";
import TreasuryIncome from "../../models/treasuryIncome.model";
import { processTreasuryImage } from "../../utils/images";
import fs from "fs/promises";

const createTreasuryIncome = async (req: Request, res: TypedResponse<TreasuryIncomeResponseDto>, next: NextFunction) => {
    try {
        const validatedData: TreasuryIncomeCreateDto = req.validatedData;
        const fee = await TreasuryIncome.create(validatedData);

        const processed: string[] = [];
        if (req.files) {
            for (const file of req.files as Express.Multer.File[]) {
                const processedImage = await processTreasuryImage(
                    file,
                    {
                        supportsWebP: res.locals.supportsWebP,
                        isLegacyBrowser: res.locals.isLegacyBrowser,
                    },
                    { imageType: "income", documentId: fee.serialID }
                );
                processed.push(processedImage.imageURL);
                try {
                    await fs.unlink(file.path);
                } catch (e) {}
            }
            fee.images = processed;
            await fee.save();
        }

        res.json({ success: true, data: toTreasuryIncomeResponseDto(fee) });
    } catch (e) {
        next(e);
    }
};

export default createTreasuryIncome;
