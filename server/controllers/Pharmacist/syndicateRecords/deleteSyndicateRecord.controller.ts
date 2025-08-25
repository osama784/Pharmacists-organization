import { NextFunction, Request, TypedResponse } from "express";
import Pharmacist from "../../../models/pharmacist.model";
import { responseMessages } from "../../../translation/response.ar";
import { PharmacistResponseDto, toPharmacistResponseDto } from "../../../types/dtos/pharmacist.dto";

const deleteSyndicateRecord = async (req: Request, res: TypedResponse<PharmacistResponseDto>, next: NextFunction) => {
    try {
        const syndicateRecordId = req.params.syndicateRecordId;
        const pharmacistId = req.params.id;

        const pharmacist = await Pharmacist.findById(pharmacistId);
        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }

        const exist = pharmacist.syndicateRecords.find((value) => value._id.toString() == syndicateRecordId);
        if (!exist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }

        const doc = await Pharmacist.findOneAndUpdate(
            {
                _id: pharmacistId,
            },
            {
                $pull: {
                    syndicateRecords: { _id: syndicateRecordId },
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

export default deleteSyndicateRecord;
