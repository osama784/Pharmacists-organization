import { NextFunction, Request, TypedResponse } from "express";
import pharmacistSchema, { licenseModel } from "../../../models/pharmacist.model";
import { responseMessages } from "../../../translation/response.ar";
import { PharmacistResponseDto, toPharmacistResponseDto } from "../../../types/dtos/pharmacist.dto";
import path from "path";
import fs from "fs/promises";
import { PARENT_DIR } from "../../../utils/images";
import {
    LicenseDocument,
    PenaltyDocument,
    SyndicateRecordDocument,
    UniversityDegreeDocument,
} from "../../../types/models/pharmacist.types";

const deleteLicense = async (req: Request, res: TypedResponse<PharmacistResponseDto>, next: NextFunction) => {
    try {
        const licenseId = req.params.licenseId;
        const pharmacistId = req.params.id;

        const pharmacist = await pharmacistSchema.findById(pharmacistId);
        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        const license = await licenseModel.findById(licenseId);
        if (!license) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        // prevent deletion of current license
        const currentLicense = await licenseModel.findById(pharmacist.currentLicense);
        if (currentLicense?._id.equals(licenseId)) {
            res.status(400).json({ success: false, details: [responseMessages.PHARMACIST_CONTROLLERS.CANT_DELETE_CURRENT_LICENSE] });
            return;
        }
        const deletedImages = license.images;
        for (const image of deletedImages) {
            const imagePath = path.join(PARENT_DIR, image);
            try {
                await fs.unlink(imagePath);
            } catch (e) {}
        }

        await license.deleteOne();
        const doc = await pharmacistSchema
            .findOneAndUpdate(
                {
                    _id: pharmacistId,
                },
                {
                    $pull: {
                        licenses: licenseId,
                    },
                },
                {
                    new: true,
                }
            )
            .populate<{
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

export default deleteLicense;
