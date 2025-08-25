import { NextFunction, Request, TypedResponse } from "express";
import Pharmacist from "../../../models/pharmacist.model";
import { responseMessages } from "../../../translation/response.ar";
import { PharmacistResponseDto, toPharmacistResponseDto, UpdatePenaltyDto } from "../../../types/dtos/pharmacist.dto";

const updatePenalty = async (req: Request, res: TypedResponse<PharmacistResponseDto>, next: NextFunction) => {
    try {
        const validatedData: UpdatePenaltyDto = req.validatedData;
        const pharmacistId = req.params.id;
        const penaltyId = req.params.penaltyId;
        const updatedFields: Record<any, any> = {};
        for (const key of Object.keys(validatedData)) {
            updatedFields[`penalties.$.${key}`] = validatedData[key as keyof UpdatePenaltyDto];
        }
        updatedFields["penalties.$._id"] = penaltyId;
        const pharmacist = await Pharmacist.findOneAndUpdate(
            {
                _id: pharmacistId,
                "penalties._id": penaltyId,
            },
            {
                $set: updatedFields,
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
