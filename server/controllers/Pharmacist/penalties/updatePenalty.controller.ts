import { NextFunction, Request, TypedResponse } from "express";
import pharmacistSchema, { penaltyModel } from "../../../models/pharmacist.model";
import { responseMessages } from "../../../translation/response.ar";
import { PharmacistResponseDto, toPharmacistResponseDto, PenaltyUpdateDto } from "../../../types/dtos/pharmacist.dto";
import {
    LicenseDocument,
    PenaltyDocument,
    SyndicateRecordDocument,
    UniversityDegreeDocument,
} from "../../../types/models/pharmacist.types";

const updatePenalty = async (req: Request, res: TypedResponse<PharmacistResponseDto>, next: NextFunction) => {
    try {
        const validatedData: PenaltyUpdateDto = req.validatedData;
        const pharmacistId = req.params.id;
        const penaltyId = req.params.penaltyId;
        const pharmacist = await pharmacistSchema.findById(pharmacistId);
        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        const penalty = await penaltyModel.findById(penaltyId);
        if (!penalty) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        await penalty.updateOne(validatedData);
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

export default updatePenalty;
