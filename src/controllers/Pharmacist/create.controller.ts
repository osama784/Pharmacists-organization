import Pharmacist, { handlePharmacistFields } from "../../models/pharmacist.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { CreatePharmacistDto, PharmacistResponseDto, toPharmacistResponseDto } from "../../types/dtos/pharmacist.dto.js";
import fs from "fs/promises";
import { processImage } from "../../utils/images.js";

const createPharmacist = async (req: Request, res: TypedResponse<PharmacistResponseDto>, next: NextFunction) => {
    try {
        const validatedData: CreatePharmacistDto = req.validatedData;
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

        const doc = await Pharmacist.create({
            ...validatedData,
            syndicateRecords: [
                {
                    syndicate: "نقابة الصيادلة المركزية",
                    startDate: validatedData.registrationDate,
                    registrationNumber: validatedData.registrationNumber,
                },
            ],
            currentSyndicate: {
                syndicate: "نقابة الصيادلة المركزية",
                startDate: validatedData.registrationDate,
                registrationNumber: validatedData.registrationNumber,
            },
            images: processed,
        });
        const pharmacist = await handlePharmacistFields(doc);
        res.json({ success: true, data: toPharmacistResponseDto(pharmacist) });
        return;
    } catch (e) {
        next(e);
    }
};

export default createPharmacist;
