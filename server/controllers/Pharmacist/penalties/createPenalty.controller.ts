import { NextFunction, Request, TypedResponse } from "express";
import Pharmacist from "../../../models/pharmacist.model";
import { responseMessages } from "../../../translation/response.ar";
import { CreatePenaltyDto, PharmacistResponseDto, toPharmacistResponseDto } from "../../../types/dtos/pharmacist.dto";

const createPenalty = async (req: Request, res: TypedResponse<PharmacistResponseDto>, next: NextFunction) => {
    try {
        const validatedData: CreatePenaltyDto = req.validatedData;
        const pharmacistId = req.params.id;
        const pharmacist = await Pharmacist.findById(pharmacistId);
        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        await pharmacist.updateOne({
            $push: {
                penalties: validatedData,
            },
        });
        const doc = await Pharmacist.findById(pharmacistId);

        res.json({ success: true, data: toPharmacistResponseDto(doc!) });
    } catch (e) {
        next(e);
    }
};

export default createPenalty;
