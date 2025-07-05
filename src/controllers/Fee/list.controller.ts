import { NextFunction, Request, TypedResponse } from "express";
import Fee from "../../models/fee.model.js";
import { FeeDocument } from "../../types/models/fee.types.js";

const listFees = async (req: Request, res: TypedResponse<FeeDocument[]>, next: NextFunction) => {
    const queryStatus = req.query.status;
    let fees = [];
    try {
        if (queryStatus == "mutable") {
            fees = await Fee.find({ isMutable: true });
        } else if (queryStatus == "immutable") {
            fees = await Fee.find({ isMutable: false });
        } else {
            fees = await Fee.find();
        }
        res.json({
            success: true,
            data: fees,
        });
    } catch (e) {
        next(e);
    }
};

export default listFees;
