import { NextFunction, Request, TypedResponse } from "express";
import pharmacistSchema, { universityDegreeModel } from "../../../models/pharmacist.model";
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

const deleteUniversityDegree = async (req: Request, res: TypedResponse<PharmacistResponseDto>, next: NextFunction) => {
    try {
        const universityDegreeId = req.params.universityDegreeId;
        const pharmacistId = req.params.id;

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
        const deletedImages = universityDegree.images;
        for (const image of deletedImages) {
            const imagePath = path.join(PARENT_DIR, image);
            try {
                await fs.unlink(imagePath);
            } catch (e) {}
        }

        await universityDegree.deleteOne();
        const doc = await pharmacistSchema
            .findOneAndUpdate(
                {
                    _id: pharmacistId,
                },
                {
                    $pull: {
                        universityDegrees: universityDegreeId,
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

export default deleteUniversityDegree;
