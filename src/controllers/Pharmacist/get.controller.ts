import { NextFunction, Request, TypedResponse } from "express";
import Pharmacist from "../../models/pharmacist.model.js";
import { PharmacistDocument } from "../../types/models/pharmacist.types.js";
import { responseMessages } from "../../translation/response.ar.js";
import { PharmacistResponseDto, toPharmacistResponseDto } from "../../types/dtos/pharmacist.dto.js";

const getPharmacist = async (req: Request, res: TypedResponse<PharmacistResponseDto>, next: NextFunction) => {
    try {
        const pharmacist = await Pharmacist.findById(req.params.id);
        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        res.json({ success: true, data: toPharmacistResponseDto(pharmacist) });
    } catch (e) {
        next(e);
    }
};

export default getPharmacist;
