import { NextFunction, Request, TypedResponse } from "express";
import Pharmacist from "../../../models/pharmacist.model";
import { responseMessages } from "../../../translation/response.ar";
import { PharmacistResponseDto, toPharmacistResponseDto } from "../../../types/dtos/pharmacist.dto";

const deletePenalty = async (req: Request, res: TypedResponse<PharmacistResponseDto>, next: NextFunction) => {
    try {
        const penaltyId = req.params.penaltyId;
        const pharmacistId = req.params.id;

        const pharmacist = await Pharmacist.findById(pharmacistId);
        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        const exist = pharmacist.penalties.find((value) => value._id.toString() == penaltyId);
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
                    penalties: { _id: penaltyId },
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

export default deletePenalty;
