import { NextFunction, Request, TypedResponse } from "express";
import Pharmacist from "../../../models/pharmacist.model";
import { responseMessages } from "../../../translation/response.ar";
import { PharmacistResponseDto, toPharmacistResponseDto, UpdatePracticeRecordDto } from "../../../types/dtos/pharmacist.dto";

const updatePracticeRecord = async (req: Request, res: TypedResponse<PharmacistResponseDto>, next: NextFunction) => {
    try {
        const validatedData: UpdatePracticeRecordDto = req.validatedData;
        const pharmacistId = req.params.id;
        const practiceRecordId = req.params.practiceRecordId;
        const pharmacist = await Pharmacist.findById(pharmacistId);
        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        const exist = pharmacist.syndicateRecords.filter((value) => value.syndicate == validatedData.syndicate);
        if (!exist) {
            res.status(400).json({ success: false, details: [responseMessages.PHARMACIST_CONTROLLERS.NO_SYNICATE_FOUND] });
            return;
        }
        const doc = await Pharmacist.findOneAndUpdate(
            {
                _id: pharmacistId,
                "practiceRecords._id": practiceRecordId,
            },
            {
                $set: {
                    "practiceRecords.$": validatedData,
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

export default updatePracticeRecord;
