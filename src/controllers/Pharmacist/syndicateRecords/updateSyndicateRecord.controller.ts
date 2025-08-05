import { NextFunction, Request, TypedResponse } from "express";
import Pharmacist from "../../../models/pharmacist.model";
import { responseMessages } from "../../../translation/response.ar";
import { PharmacistResponseDto, toPharmacistResponseDto, UpdateSyndicateRecordDto } from "../../../types/dtos/pharmacist.dto";

const updateSyndicateRecord = async (req: Request, res: TypedResponse<PharmacistResponseDto>, next: NextFunction) => {
    try {
        const validatedData: UpdateSyndicateRecordDto = req.validatedData;
        const pharmacistId = req.params.id;
        const syndicateRecordId = req.params.syndicateRecordId;
        const pharmacist = await Pharmacist.findOneAndUpdate(
            {
                _id: pharmacistId,
                "syndicateRecords._id": syndicateRecordId,
            },
            {
                $set: {
                    "syndicateRecords.$": validatedData,
                },
            },
            {
                new: true,
            }
        );

        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }

        res.json({ success: true, data: toPharmacistResponseDto(pharmacist) });
    } catch (e) {
        next(e);
    }
};

export default updateSyndicateRecord;
