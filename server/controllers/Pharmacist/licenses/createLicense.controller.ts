import { NextFunction, Request, TypedResponse } from "express";
import Pharmacist from "../../../models/pharmacist.model";
import { responseMessages } from "../../../translation/response.ar";
import { CreateLicenseDto, PharmacistResponseDto, toPharmacistResponseDto } from "../../../types/dtos/pharmacist.dto";
import fs from "fs/promises";
import { processImage } from "../../../utils/images";

const createLicense = async (req: Request, res: TypedResponse<PharmacistResponseDto>, next: NextFunction) => {
    try {
        const validatedData: CreateLicenseDto = req.validatedData;
        const pharmacistId = req.params.id;
        const pharmacist = await Pharmacist.findById(pharmacistId);
        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        const processed: string[] = [];
        if (req.files) {
            for (const file of req.files as Express.Multer.File[]) {
                const processedImage = await processImage(file, {
                    userId: req.params.id,
                    supportsWebP: res.locals.supportsWebP,
                    isLegacyBrowser: res.locals.isLegacyBrowser,
                });
                processed.push(processedImage.imageURL);
                try {
                    await fs.unlink(file.path);
                } catch (e) {
                    console.log(e);
                }
            }
        }

        await pharmacist.updateOne({
            $push: {
                licenses: { ...validatedData, images: processed },
            },
        });
        const doc = await Pharmacist.findById(pharmacistId);

        res.json({ success: true, data: toPharmacistResponseDto(doc!) });
    } catch (e) {
        next(e);
    }
};

export default createLicense;
