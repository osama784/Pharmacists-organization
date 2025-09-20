import { NextFunction, Request, TypedResponse } from "express";
import { toTreasuryIncomeResponseDto, TreasuryIncomeResponseDto, TreasuryIncomeUpdateDto } from "../../types/dtos/treasuryIncome.dto";
import TreasuryIncome from "../../models/treasuryIncome.model";
import { responseMessages } from "../../translation/response.ar";
import { PARENT_DIR, processTreasuryImage } from "../../utils/images";
import path from "path";
import fs from "fs/promises";

const updateTreasuryIncome = async (req: Request, res: TypedResponse<TreasuryIncomeResponseDto>, next: NextFunction) => {
    try {
        const validatedData: TreasuryIncomeUpdateDto = req.validatedData;
        const fee = await TreasuryIncome.findOne({ serialID: req.params.id });
        if (!fee) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        let updatedFields: TreasuryIncomeUpdateDto = { ...validatedData, image: undefined };
        if ((validatedData.image == null || validatedData.image == "" || req.file) && fee.image) {
            updatedFields = { ...updatedFields, image: "" };
            const imagePath = path.join(PARENT_DIR, fee.image);
            try {
                await fs.access(imagePath);
                await fs.rm(imagePath, { force: true, recursive: true });
            } catch (e) {
                console.log(e);
            }
        }
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
            updatedFields = { ...updatedFields, image: processedImage.imageURL };
            try {
                await fs.unlink(file.path);
            } catch (e) {}
        }
        await fee.updateOne(updatedFields);

        const doc = await TreasuryIncome.findById(fee.id);

        res.json({ success: true, data: toTreasuryIncomeResponseDto(doc!) });
    } catch (e) {
        next(e);
    }
};

export default updateTreasuryIncome;
