import { NextFunction, Request, TypedResponse } from "express";
import {
    toTreasuryExpenditureResponseDto,
    TreasuryExpenditureResponseDto,
    TreasuryExpenditureUpdateDto,
} from "../../types/dtos/treasuryExpenditure.dto";
import TreasuryExpenditure from "../../models/treasuryExpenditure.model";
import { responseMessages } from "../../translation/response.ar";
import fs from "fs/promises";
import { processTreasuryImage, PROJECT_DIR } from "../../utils/images";
import path from "path";

const updateTreasuryExpenditure = async (req: Request, res: TypedResponse<TreasuryExpenditureResponseDto>, next: NextFunction) => {
    try {
        const validatedData: TreasuryExpenditureUpdateDto = req.validatedData;
        const fee = await TreasuryExpenditure.findOne({ serialID: req.params.id });
        if (!fee) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        let updatedFields: TreasuryExpenditureUpdateDto = validatedData;
        if ((validatedData.image == null || req.file) && fee.image) {
            const imagePath = path.join(PROJECT_DIR, fee.image);
            try {
                await fs.access(imagePath);
                await fs.rm(imagePath, { force: true, recursive: true });
            } catch (e) {}
        }
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
            updatedFields = { ...updatedFields, image: processedImage.imageURL };
            try {
                await fs.unlink(file.path);
            } catch (e) {
                console.log(e);
            }
        }

        await fee.updateOne(updatedFields);

        const doc = await TreasuryExpenditure.findById(fee.id);

        res.json({ success: true, data: toTreasuryExpenditureResponseDto(doc!) });
    } catch (e) {
        next(e);
    }
};

export default updateTreasuryExpenditure;
