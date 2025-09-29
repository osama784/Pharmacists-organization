import pharmacistSchema, { handlePharmacistFields } from "../../models/pharmacist.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { PharmacistResponseDto, toPharmacistResponseDto, UpdatePharmacistDto } from "../../types/dtos/pharmacist.dto.js";
import { responseMessages } from "../../translation/response.ar.js";
import fs from "fs/promises";
import path from "path";
import { PARENT_DIR, processPharmacistImage } from "../../utils/images.js";
import {
    LicenseDocument,
    PenaltyDocument,
    SyndicateRecordDocument,
    UniversityDegreeDocument,
} from "../../types/models/pharmacist.types.js";

const updatePharmacist = async (req: Request, res: TypedResponse<PharmacistResponseDto>, next: NextFunction) => {
    try {
        const validatedData: UpdatePharmacistDto = req.validatedData;
        const pharmacist = await pharmacistSchema.findById(req.params.id);
        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        const newImages = validatedData.images;
        const oldImages = pharmacist.images;
        let imagesURLs: string[] = [];
        if (newImages) {
            // check if added a new url to the source array
            for (const image of newImages) {
                if (!oldImages.includes(image)) {
                    res.status(400).json({ success: false, details: [responseMessages.PHARMACIST_CONTROLLERS.PREVENT_ADDING_IMAGES_URLS] });
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
                const processedImage = await processPharmacistImage(
                    file,
                    {
                        supportsWebP: res.locals.supportsWebP,
                        isLegacyBrowser: res.locals.isLegacyBrowser,
                    },
                    { imageType: "personal", pharmacistId: req.params.id }
                );
                if (!imagesURLs.includes(processedImage.imageURL)) {
                    imagesURLs.push(processedImage.imageURL);
                }
                try {
                    await fs.unlink(file.path);
                } catch (e) {}
            }
        }

        await pharmacist.updateOne({ $set: { ...validatedData, images: imagesURLs } });
        const doc = await pharmacistSchema.findById(pharmacist._id).populate<{
            currentSyndicate: SyndicateRecordDocument;
            currentLicense: LicenseDocument;
            licenses: LicenseDocument[];
            syndicateRecords: SyndicateRecordDocument[];
            universityDegrees: UniversityDegreeDocument[];
            penalties: PenaltyDocument[];
        }>(["licenses", "universityDegrees", "syndicateRecords", "penalties", "currentSyndicate", "currentLicense"]);
        const newDoc = await handlePharmacistFields(doc!);

        res.json({ success: true, data: toPharmacistResponseDto(newDoc!) });
    } catch (e) {
        next(e);
    }
};

export default updatePharmacist;
