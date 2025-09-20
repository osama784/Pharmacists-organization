import { NextFunction, Request, TypedResponse } from "express";
import { toTreasuryIncomeResponseDto, TreasuryIncomeResponseDto, TreasuryIncomeUpdateDto } from "../../types/dtos/treasuryIncome.dto";
import TreasuryIncome from "../../models/treasuryIncome.model";
import { responseMessages } from "../../translation/response.ar";
import { PARENT_DIR, processTreasuryImage } from "../../utils/images";
import path from "path";
import fs from "fs/promises";

const updateTreasuryIncome = async (req: Request, res: TypedResponse<TreasuryIncomeResponseDto>, next: NextFunction) => {
    try {
        const feeId = req.params.id;
        const validatedData: TreasuryIncomeUpdateDto = req.validatedData;
        const fee = await TreasuryIncome.findOne({ serialID: feeId });
        if (!fee) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        const newImages = validatedData.images;
        const oldImages = fee.images;
        let imagesURLs: string[] = [];
        if (newImages) {
            // check if added a new url to the source array
            for (const image of newImages) {
                if (!oldImages.includes(image)) {
                    res.status(400).json({
                        success: false,
                        details: [responseMessages.TREASURY_INCOMES_CONTROLLERS.PREVENT_ADDING_IMAGES_URLS],
                    });
                    return;
                }
            }
            // handle deleted images
            const deletedImages = oldImages.filter((image) => !newImages.includes(image));
            for (const image of deletedImages) {
                const imagePath = path.join(PARENT_DIR, image);
                try {
                    await fs.unlink(imagePath);
                } catch (e) {}
            }
            imagesURLs = newImages;
        } else {
            imagesURLs = oldImages;
        }
        // handle uploaded images
        if (req.files) {
            for (const file of req.files as Express.Multer.File[]) {
                const processedImage = await processTreasuryImage(
                    file,
                    {
                        supportsWebP: res.locals.supportsWebP,
                        isLegacyBrowser: res.locals.isLegacyBrowser,
                    },
                    { imageType: "income", documentId: feeId }
                );
                if (!imagesURLs.includes(processedImage.imageURL)) {
                    imagesURLs.push(processedImage.imageURL);
                }
                try {
                    await fs.unlink(file.path);
                } catch (e) {}
            }
        }

        await fee.updateOne({ ...validatedData, images: imagesURLs });

        const doc = await TreasuryIncome.findById(fee.id);

        res.json({ success: true, data: toTreasuryIncomeResponseDto(doc!) });
    } catch (e) {
        next(e);
    }
};

export default updateTreasuryIncome;
