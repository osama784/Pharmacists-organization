import { NextFunction, Request, TypedResponse } from "express";
import Fee from "../../models/fee.model.js";
import { FeeDocument } from "../../types/models/fee.types.js";

const updateFeesValues = async (req: Request, res: TypedResponse<FeeDocument[]>, next: NextFunction) => {
    let result = [];
    try {
        for (const feeObject of req.validatedData) {
            if (!feeObject.detail && !feeObject.value) {
                res.status(400).json({
                    success: false,
                    details: ['please send "detail" object if the fee is mutable, otherwise send "value" number'],
                });
                return;
            }
            const fee = await Fee.findById(feeObject.id);
            if (!fee) {
                res.status(404).json({ success: false });
                return;
            }
            if (fee.isMutable) {
                if (!feeObject.detail) {
                    res.status(400).json({ success: false, details: ['please send "detail" object if the fee is mutable'] });
                    return;
                }
                await fee.updateOne({
                    $set: {
                        detail: feeObject.detail,
                    },
                });
                const doc = await Fee.findById(fee._id);
                result.push(doc!);
            } else {
                if (!feeObject.value) {
                    res.status(400).json({ success: false, details: ['please send "value" number if the fee is immutable'] });
                    return;
                }
                await fee.updateOne({
                    $set: {
                        value: feeObject.value,
                    },
                });
                const doc = await Fee.findById(fee._id);
                result.push(doc!);
            }
        }

        res.json({ success: true, data: result });
    } catch (e) {
        next(e);
    }
};

export default updateFeesValues;
