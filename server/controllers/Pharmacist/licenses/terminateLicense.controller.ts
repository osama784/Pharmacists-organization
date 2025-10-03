import { NextFunction, Request, TypedResponse } from "express";
import pharmacistSchema from "../../../models/pharmacist.model";
import { responseMessages } from "../../../translation/response.ar";
import { PharmacistResponseDto, toPharmacistResponseDto } from "../../../types/dtos/pharmacist.dto";
import {
    LicenseDocument,
    PenaltyDocument,
    SyndicateRecordDocument,
    UniversityDegreeDocument,
} from "../../../types/models/pharmacist.types";
import { PracticeState } from "../../../enums/pharmacist.enums";

const terminateCurrentLicense = async (req: Request, res: TypedResponse<PharmacistResponseDto>, next: NextFunction) => {
    try {
        const pharmacistId = req.params.id;

        const pharmacist = await pharmacistSchema.findById(pharmacistId);
        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        if (!pharmacist.currentLicense) {
            res.status(400).json({ success: false, details: [responseMessages.PHARMACIST_CONTROLLERS.NO_CURRENT_LICENSE_FOUND] });
            return;
        }
        const doc = await pharmacistSchema
            .findOneAndUpdate(
                {
                    _id: pharmacistId,
                },
                {
                    currentLicense: null,
                    // practiceState: PracticeState.UNPRACTICED,
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

export default terminateCurrentLicense;
