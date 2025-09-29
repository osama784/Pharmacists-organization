import pharmacistSchema, { handlePharmacistFields, syndicateRecordModel } from "../../models/pharmacist.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { CreatePharmacistDto, PharmacistResponseDto, toPharmacistResponseDto } from "../../types/dtos/pharmacist.dto.js";
import fs from "fs/promises";
import { processPharmacistImage } from "../../utils/images.js";
import {
    LicenseDocument,
    PenaltyDocument,
    SyndicateRecordDocument,
    UniversityDegreeDocument,
} from "../../types/models/pharmacist.types.js";

const createPharmacist = async (req: Request, res: TypedResponse<PharmacistResponseDto>, next: NextFunction) => {
    try {
        const validatedData: CreatePharmacistDto = req.validatedData;

        // create pharmacist without saving it to add required fields
        const pharmacist = new pharmacistSchema(validatedData);
        const syndicateRecord = await syndicateRecordModel.create({
            pharmacist: pharmacist.id,
            syndicate: "نقابة الصيادلة المركزية",
            startDate: validatedData.registrationDate,
            registrationNumber: validatedData.registrationNumber,
        });
        pharmacist.syndicateRecords = [syndicateRecord.id];
        pharmacist.currentSyndicate = syndicateRecord.id;

        const imagesURLs: string[] = [];
        if (req.files) {
            for (const file of req.files as Express.Multer.File[]) {
                const processedImage = await processPharmacistImage(
                    file,
                    {
                        supportsWebP: res.locals.supportsWebP,
                        isLegacyBrowser: res.locals.isLegacyBrowser,
                    },
                    { imageType: "personal", pharmacistId: pharmacist.id }
                );
                imagesURLs.push(processedImage.imageURL);
                try {
                    await fs.unlink(file.path);
                } catch (e) {}
            }
            pharmacist.images = imagesURLs;
        }

        await handlePharmacistFields(pharmacist);
        const doc = await pharmacistSchema.findById(pharmacist.id).populate<{
            currentSyndicate: SyndicateRecordDocument;
            currentLicense: LicenseDocument;
            licenses: LicenseDocument[];
            syndicateRecords: SyndicateRecordDocument[];
            universityDegrees: UniversityDegreeDocument[];
            penalties: PenaltyDocument[];
        }>(["licenses", "universityDegrees", "syndicateRecords", "penalties", "currentSyndicate", "currentLicense"]);
        res.json({ success: true, data: toPharmacistResponseDto(doc!) });
        return;
    } catch (e) {
        next(e);
    }
};

export default createPharmacist;
