import Pharmacist, { handlePharmacistFields } from "../../models/pharmacist.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { CreatePharmacistDto, PharmacistResponseDto, toPharmacistResponseDto } from "../../types/dtos/pharmacist.dto.js";

const createPharmacist = async (req: Request, res: TypedResponse<PharmacistResponseDto>, next: NextFunction) => {
    try {
        const validatedData: CreatePharmacistDto = req.validatedData;
        const doc = await Pharmacist.create({
            ...validatedData,
            syndicateRecords: [
                {
                    syndicate: "نقابة الصيادلة المركزية",
                    startDate: validatedData.registrationDate,
                    registrationNumber: validatedData.registrationNumber,
                },
            ],
        });
        const pharmacist = await handlePharmacistFields(doc);
        res.json({ success: true, data: toPharmacistResponseDto(pharmacist) });
        return;
    } catch (e) {
        next(e);
    }
};

export default createPharmacist;
