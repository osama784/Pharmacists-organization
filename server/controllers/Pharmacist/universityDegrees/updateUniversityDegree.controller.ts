import { NextFunction, Request, TypedResponse } from "express";
import pharmacistSchema, { universityDegreeModel } from "../../../models/pharmacist.model";
import { responseMessages } from "../../../translation/response.ar";
import { PharmacistResponseDto, toPharmacistResponseDto, UniversityDegreeUpdateDto } from "../../../types/dtos/pharmacist.dto";
import { PARENT_DIR, processPharmacistImage } from "../../../utils/images";
import {
    LicenseDocument,
    PenaltyDocument,
    SyndicateRecordDocument,
    UniversityDegreeDocument,
} from "../../../types/models/pharmacist.types";
import fs from "fs/promises";
import path from "path";

const updateUniversityDegree = async (req: Request, res: TypedResponse<PharmacistResponseDto>, next: NextFunction) => {
    try {
        const validatedData: UniversityDegreeUpdateDto = req.validatedData;
        const pharmacistId = req.params.id;
        const universityDegreeId = req.params.universityDegreeId;
        const pharmacist = await pharmacistSchema.findById(pharmacistId);
        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        const universityDegree = await universityDegreeModel.findById(universityDegreeId);
        if (!universityDegree) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        const newImages = validatedData.images;
        const oldImages = universityDegree.images;
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

        await universityDegreeModel.updateOne({
            ...validatedData,
            images: imagesURLs,
        });
        await pharmacist.populate<{
            currentSyndicate: SyndicateRecordDocument;
            currentLicense: LicenseDocument;
            licenses: LicenseDocument[];
            syndicateRecords: SyndicateRecordDocument[];
            universityDegrees: UniversityDegreeDocument[];
            penalties: PenaltyDocument[];
        }>(["licenses", "universityDegrees", "syndicateRecords", "penalties", "currentSyndicate", "currentLicense"]);

        res.json({ success: true, data: toPharmacistResponseDto(pharmacist) });
    } catch (e) {
        next(e);
    }
};

export default updateUniversityDegree;
