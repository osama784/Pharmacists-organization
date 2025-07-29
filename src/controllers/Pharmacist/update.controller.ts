import Pharmacist, { handlePharmacistFields } from "../../models/pharmacist.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { PharmacistDocument } from "../../types/models/pharmacist.types.js";
import { PharmacistResponseDto, toPharmacistResponseDto, UpdatePharmacistDto } from "../../types/dtos/pharmacist.dto.js";
import { responseMessages } from "../../translation/response.ar.js";

const updatePharmacist = async (req: Request, res: TypedResponse<PharmacistResponseDto>, next: NextFunction) => {
    try {
        const validatedData: UpdatePharmacistDto = req.validatedData;
        const pharmacist = await Pharmacist.findById(req.params.id);
        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        await pharmacist.updateOne({ $set: validatedData });
        const doc = await Pharmacist.findById(pharmacist._id);
        const newDoc = await handlePharmacistFields(doc!);

        res.json({ success: true, data: toPharmacistResponseDto(newDoc!) });
    } catch (e) {
        next(e);
    }
};

export default updatePharmacist;
