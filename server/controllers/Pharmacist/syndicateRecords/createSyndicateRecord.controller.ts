import { NextFunction, Request, TypedResponse } from "express";
import pharmacistSchema, { licenseModel, syndicateRecordModel } from "../../../models/pharmacist.model";
import { responseMessages } from "../../../translation/response.ar";
import { SyndicateRecordCreateDto, PharmacistResponseDto, toPharmacistResponseDto } from "../../../types/dtos/pharmacist.dto";
import {
    LicenseDocument,
    PenaltyDocument,
    SyndicateRecordDocument,
    UniversityDegreeDocument,
} from "../../../types/models/pharmacist.types";
import { Syndicate, TransferReason } from "../../../enums/pharmacist.enums";

const createSyndicateRecord = async (req: Request, res: TypedResponse<PharmacistResponseDto>, next: NextFunction) => {
    try {
        const validatedData: SyndicateRecordCreateDto = req.validatedData;
        const pharmacistId = req.params.id;
        const pharmacist = await pharmacistSchema.findById(pharmacistId);
        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        // validate currentSyndicate
        const currentSyndicate = await syndicateRecordModel.findById(pharmacist.currentSyndicate);
        let currentLicense = null;
        if (pharmacist.currentLicense) {
            currentLicense = await licenseModel.findById(pharmacist.currentLicense);
        }
        // every piece of validation here describes itself by returned message
        if (validatedData.syndicate == currentSyndicate?.syndicate) {
            res.status(400).json({ success: false, details: [responseMessages.PHARMACIST_CONTROLLERS.CANT_TRANSFER_TO_SAME_SYNDICATE] });
            return;
        }
        if (currentSyndicate?.syndicate != Syndicate.CENTRAL && validatedData.syndicate != Syndicate.CENTRAL) {
            res.status(400).json({ success: false, details: [responseMessages.PHARMACIST_CONTROLLERS.CANT_TRANSFER_TO_SYNDICATE_BRANCH] });
            return;
        }
        if (currentLicense && currentSyndicate?.syndicate == Syndicate.CENTRAL && validatedData.syndicate != currentLicense.syndicate) {
            res.status(400).json({
                success: false,
                details: [responseMessages.PHARMACIST_CONTROLLERS.SHOULD_RETURN_TO_SAME_SYNDICATE_BRANCH],
            });
            return;
        }
        if (currentSyndicate?.syndicate == Syndicate.CENTRAL && validatedData.transferReason != TransferReason.TRANSFER_TO_BRANCH) {
            res.status(400).json({
                success: false,
                details: [responseMessages.PHARMACIST_CONTROLLERS.TRANSFER_REASON_SHOULD_BE_TRANSFER_TO_BRANCH],
            });
            return;
        }
        if (
            currentSyndicate?.syndicate != Syndicate.CENTRAL &&
            ![TransferReason.CANCELLATION_OF_REGISTRATION, TransferReason.DEATH, TransferReason.RETIREMENT].includes(
                validatedData.transferReason as TransferReason
            )
        ) {
            res.status(400).json({ success: false, details: [responseMessages.PHARMACIST_CONTROLLERS.INVALID_TRANSFER_REASON] });
            return;
        }
        // now pharmacist can transfer
        currentSyndicate?.set("endDate", new Date());
        await currentSyndicate?.save();

        // create new syndicateRecord
        const syndicateRecord = await syndicateRecordModel.create({ ...validatedData, pharmacist: pharmacistId });
        let updatedFields: Record<string, any> = {
            $push: {
                syndicateRecords: syndicateRecord,
            },
            currentSyndicate: syndicateRecord,
        };

        await pharmacist.updateOne(updatedFields);
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

export default createSyndicateRecord;
