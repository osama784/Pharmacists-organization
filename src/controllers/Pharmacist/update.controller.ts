import Pharmacist from "../../models/pharmacist.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { PharmacistDocument } from "../../types/models/pharmacist.types.js";
import { updatePharmacistDto } from "../../types/dtos/pharmacist.dto.js";

const updatePharmacist = async (req: Request, res: TypedResponse<PharmacistDocument>, next: NextFunction) => {
    try {
        const validatedData: updatePharmacistDto = req.validatedData;
        const pharmacist = await Pharmacist.findById(req.params.id);
        if (!pharmacist) {
            res.status(404).json({ success: false });
            return;
        }
        await pharmacist.updateOne({ $set: validatedData });
        const doc = await Pharmacist.findById(pharmacist._id);
        res.json({ success: true, data: doc! });
    } catch (e) {
        next(e);
    }
};

export default updatePharmacist;
