import { NextFunction, Request, TypedResponse } from "express";
import pharmacistSchema, { penaltyModel } from "../../../models/pharmacist.model";
import { responseMessages } from "../../../translation/response.ar";
import { PenaltyCreateDto, PharmacistResponseDto, toPharmacistResponseDto } from "../../../types/dtos/pharmacist.dto";
import {
    LicenseDocument,
    PenaltyDocument,
    SyndicateRecordDocument,
    UniversityDegreeDocument,
} from "../../../types/models/pharmacist.types";

const createPenalty = async (req: Request, res: TypedResponse<PharmacistResponseDto>, next: NextFunction) => {
    try {
        const validatedData: PenaltyCreateDto = req.validatedData;
        const pharmacistId = req.params.id;
        const pharmacist = await pharmacistSchema.findById(pharmacistId);
        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        const penalty = await penaltyModel.create({ ...validatedData, pharmacist: pharmacistId });
        await pharmacist.updateOne({
            $push: {
                penalties: penalty,
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

export default createPenalty;
