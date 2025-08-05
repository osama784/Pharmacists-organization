import { NextFunction, Request, TypedResponse } from "express";
import Pharmacist from "../../../models/pharmacist.model";
import { responseMessages } from "../../../translation/response.ar";
import { CreateSyndicateRecordDto, PharmacistResponseDto, toPharmacistResponseDto } from "../../../types/dtos/pharmacist.dto";

const createSyndicateRecord = async (req: Request, res: TypedResponse<PharmacistResponseDto>, next: NextFunction) => {
    try {
        const validatedData: CreateSyndicateRecordDto = req.validatedData;
        const pharmacistId = req.params.id;
        const pharmacist = await Pharmacist.findById(pharmacistId);
        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        let updatedFields: Record<string, any> = {
            $push: {
                syndicateRecords: validatedData,
            },
        };
        if (!validatedData.endDate) {
            updatedFields = { ...updatedFields, currentSyndicate: validatedData };
        }
        await pharmacist.updateOne(updatedFields);
        const doc = await Pharmacist.findById(pharmacistId);

        res.json({ success: true, data: toPharmacistResponseDto(doc!) });
    } catch (e) {
        next(e);
    }
};

export default createSyndicateRecord;
