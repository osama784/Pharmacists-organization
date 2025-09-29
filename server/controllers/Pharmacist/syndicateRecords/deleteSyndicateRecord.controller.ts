import { NextFunction, Request, TypedResponse } from "express";
import pharmacistSchema, { syndicateRecordModel } from "../../../models/pharmacist.model";
import { responseMessages } from "../../../translation/response.ar";
import { PharmacistResponseDto, toPharmacistResponseDto } from "../../../types/dtos/pharmacist.dto";
import {
    LicenseDocument,
    PenaltyDocument,
    SyndicateRecordDocument,
    UniversityDegreeDocument,
} from "../../../types/models/pharmacist.types";

const deleteSyndicateRecord = async (req: Request, res: TypedResponse<PharmacistResponseDto>, next: NextFunction) => {
    try {
        const syndicateRecordId = req.params.syndicateRecordId;
        const pharmacistId = req.params.id;

        const pharmacist = await pharmacistSchema.findById(pharmacistId);
        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }

        const syndicateRecord = await syndicateRecordModel.findById(syndicateRecordId);
        if (!syndicateRecord) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        // prevent deletion of current syndicate
        const currentSyndicate = await syndicateRecordModel.findById(pharmacist.currentSyndicate);
        if (currentSyndicate?._id.equals(syndicateRecordId)) {
            res.status(400).json({ success: false, details: [responseMessages.PHARMACIST_CONTROLLERS.CANT_DELETE_CURRENT_SYNDICATE] });
            return;
        }
        await syndicateRecord.deleteOne();

        const doc = await pharmacistSchema
            .findOneAndUpdate(
                {
                    _id: pharmacistId,
                },
                {
                    $pull: {
                        syndicateRecords: syndicateRecordId,
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

export default deleteSyndicateRecord;
