import Pharmacist from "../../models/pharmacist.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { PharmacistDocument } from "../../types/models/pharmacist.types.js";
import { CreatePharmacistDto, PharmacistResponseDto, toPharmacistResponseDto } from "../../types/dtos/pharmacist.dto.js";

const createPharmacist = async (req: Request, res: TypedResponse<PharmacistResponseDto>, next: NextFunction) => {
    try {
        const validatedData: CreatePharmacistDto = req.validatedData;
        const pharmacist = await Pharmacist.create(validatedData);
        res.json({ success: true, data: toPharmacistResponseDto(pharmacist) });
        return;
    } catch (e) {
        next(e);
    }
};

export default createPharmacist;
