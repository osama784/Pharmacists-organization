import { NextFunction, Request, TypedResponse } from "express";
import Pharmacist from "../../../models/pharmacist.model";
import { responseMessages } from "../../../translation/response.ar";
import { PharmacistResponseDto, toPharmacistResponseDto, UpdatePenaltyDto } from "../../../types/dtos/pharmacist.dto";

const updatePenalty = async (req: Request, res: TypedResponse<PharmacistResponseDto>, next: NextFunction) => {
    try {
        const validatedData: UpdatePenaltyDto = req.validatedData;
        const pharmacistId = req.params.id;
        const penaltyId = req.params.penaltyId;
        const pharmacist = await Pharmacist.findOneAndUpdate(
            {
                _id: pharmacistId,
                "penalties._id": penaltyId,
            },
            {
                $set: {
                    "penalties.$": validatedData,
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

export default updatePenalty;
