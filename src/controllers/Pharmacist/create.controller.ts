import Pharmacist from "../../models/pharmacist.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { PharmacistDocument } from "../../types/models/pharmacist.types.js";
import { createPharmacistDto } from "../../types/dtos/pharmacist.dto.js";

const createPharmacist = async (req: Request, res: TypedResponse<PharmacistDocument>, next: NextFunction) => {
    try {
        const validatedData: createPharmacistDto = req.validatedData;
        const pharmacist = await Pharmacist.create(validatedData);
        res.json({ success: true, data: pharmacist });
        return;
    } catch (e) {
        next(e);
    }
};

export default createPharmacist;
