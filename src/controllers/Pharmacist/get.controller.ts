import { NextFunction, Request, TypedResponse } from "express";
import Pharmacist from "../../models/pharmacist.model.js";
import { PharmacistDocument } from "../../types/models/pharmacist.types.js";

const getPharmacist = async (req: Request, res: TypedResponse<PharmacistDocument>, next: NextFunction) => {
    try {
        const pharmacist = await Pharmacist.findById(req.params.id);
        if (!pharmacist) {
            res.status(404).json({ success: false });
            return;
        }
        res.json({ success: true, data: pharmacist });
    } catch (e) {
        next(e);
    }
};

export default getPharmacist;
