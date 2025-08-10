import { NextFunction, Request, TypedResponse } from "express";
import Pharmacist from "../../../models/pharmacist.model";
import { responseMessages } from "../../../translation/response.ar";
import { PharmacistResponseDto, toPharmacistResponseDto, UpdateUniversityDegreeDto } from "../../../types/dtos/pharmacist.dto";
import { processImage } from "../../../utils/images";
import fs from "fs/promises";
import path from "path";

const updateUniversityDegree = async (req: Request, res: TypedResponse<PharmacistResponseDto>, next: NextFunction) => {
    try {
        const validatedData: UpdateUniversityDegreeDto = req.validatedData;
        const pharmacistId = req.params.id;
        const universityDegreeId = req.params.universityDegreeId;
        const pharmacist = await Pharmacist.findById(pharmacistId);
        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        const exist = pharmacist.universityDegrees.find((value) => value._id.toString() == universityDegreeId);
        if (!exist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        const newImages = validatedData.images;
        const oldImages = exist.images;
        let imagesURLs: string[] = [];
        if (newImages) {
            // check if added a new url to the source array
            for (const image of newImages) {
                if (!oldImages.includes(image)) {
                    res.status(400).json({ success: false, details: [responseMessages.PHARMACIST_CONTROLLERS.INVALID_IMAGES_URLS] });
                    return;
                }
            }
            // handle deleted images
            const deletedImages = oldImages.filter((image) => !newImages.includes(image));
            for (const image of deletedImages) {
                const imagePath = path.join(__dirname, "..", "..", "..", "..", "..", image);
                try {
                    await fs.unlink(imagePath);
                } catch (e) {
                    console.log(e);
                }
            }
            imagesURLs = newImages;
        } else {
            imagesURLs = oldImages;
        }
        // handle uploaded images
        if (req.files) {
            for (const file of req.files as Express.Multer.File[]) {
                const processedImage = await processImage(file, {
                    userId: req.params.id,
                    supportsWebP: res.locals.supportsWebP,
                    isLegacyBrowser: res.locals.isLegacyBrowser,
                });
                if (!imagesURLs.includes(processedImage.imageURL)) {
                    imagesURLs.push(processedImage.imageURL);
                }
                try {
                    await fs.unlink(file.path);
                } catch (e) {
                    console.log(e);
                }
            }
        }

        const doc = await Pharmacist.findOneAndUpdate(
            {
                _id: pharmacistId,
                "universityDegrees._id": universityDegreeId,
            },
            {
                $set: {
                    "universityDegrees.$": { ...validatedData, images: imagesURLs, _id: universityDegreeId },
                },
            },
            {
                new: true,
            }
        );

        res.json({ success: true, data: toPharmacistResponseDto(doc!) });
    } catch (e) {
        next(e);
    }
};

export default updateUniversityDegree;
