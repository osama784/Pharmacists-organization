import { NextFunction, Request, TypedResponse } from "express";
import pharmacistSchema from "../../models/pharmacist.model.js";
import { responseMessages } from "../../translation/response.ar.js";
import { PharmacistResponseDto, toPharmacistResponseDto } from "../../types/dtos/pharmacist.dto.js";
import { LicenseDocument, PenaltyDocument, SyndicateRecordDocument, UniversityDegreeDocument } from "../../types/models/pharmacist.types";

const getPharmacist = async (req: Request, res: TypedResponse<PharmacistResponseDto>, next: NextFunction) => {
    try {
        const pharmacist = await pharmacistSchema.findById(req.params.id).populate<{
            currentSyndicate: SyndicateRecordDocument;
            currentLicense: LicenseDocument;
            licenses: LicenseDocument[];
            syndicateRecords: SyndicateRecordDocument[];
            universityDegrees: UniversityDegreeDocument[];
            penalties: PenaltyDocument[];
        }>(["licenses", "universityDegrees", "syndicateRecords", "penalties", "currentSyndicate", "currentLicense"]);
        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        res.json({ success: true, data: toPharmacistResponseDto(pharmacist) });
    } catch (e) {
        next(e);
    }
};

export default getPharmacist;
