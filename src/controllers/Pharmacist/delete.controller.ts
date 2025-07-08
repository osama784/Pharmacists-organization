import Pharmacist from "../../models/pharmacist.model.js";
import { NextFunction, Request, TypedResponse } from "express";

const deletePharmacist = async (req: Request, res: TypedResponse<null>, next: NextFunction) => {
    try {
        const result = await Pharmacist.deleteOne({ _id: req.params.id });

        if (result.deletedCount != 1) {
            res.status(404);
            return;
        }
        res.sendStatus(204);
    } catch (e) {
        next(e);
    }
};

export default deletePharmacist;
