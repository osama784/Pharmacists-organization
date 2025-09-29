import { NextFunction, Request, TypedResponse } from "express";
import pharmacistSchema, { universityDegreeModel } from "../../../models/pharmacist.model";
import { responseMessages } from "../../../translation/response.ar";
import { UniversityDegreeCreateDto, PharmacistResponseDto, toPharmacistResponseDto } from "../../../types/dtos/pharmacist.dto";
import { processPharmacistImage } from "../../../utils/images";
import fs from "fs/promises";
import {
    LicenseDocument,
    PenaltyDocument,
    SyndicateRecordDocument,
    UniversityDegreeDocument,
} from "../../../types/models/pharmacist.types";

const createUniversityDegree = async (req: Request, res: TypedResponse<PharmacistResponseDto>, next: NextFunction) => {
    try {
        const validatedData: UniversityDegreeCreateDto = req.validatedData;
        const pharmacistId = req.params.id;
        const pharmacist = await pharmacistSchema.findById(pharmacistId);
        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        const imagesURLS: string[] = [];
        if (req.files) {
            for (const file of req.files as Express.Multer.File[]) {
                const processedImage = await processPharmacistImage(
                    file,
                    {
                        supportsWebP: res.locals.supportsWebP,
                        isLegacyBrowser: res.locals.isLegacyBrowser,
                    },
                    { imageType: "personal", pharmacistId: req.params.id }
                );
                imagesURLS.push(processedImage.imageURL);
                try {
                    await fs.unlink(file.path);
                } catch (e) {}
            }
        }
        const universityDegree = await universityDegreeModel.create({
            ...validatedData,
            pharmacist: pharmacistId,
            images: imagesURLS,
        });

        await pharmacist.updateOne({
            $push: {
                universityDegrees: universityDegree,
            },
        });
        const doc = await pharmacistSchema.findById(pharmacistId).populate<{
            currentSyndicate: SyndicateRecordDocument;
            currentLicense: LicenseDocument;
            licenses: LicenseDocument[];
            syndicateRecords: SyndicateRecordDocument[];
            universityDegrees: UniversityDegreeDocument[];
            penalties: PenaltyDocument[];
        }>(["licenses", "universityDegrees", "syndicateRecords", "penalties", "currentSyndicate", "currentLicense"]);

        res.json({ success: true, data: toPharmacistResponseDto(doc!) });
    } catch (e) {
        next(e);
    }
};

export default createUniversityDegree;
