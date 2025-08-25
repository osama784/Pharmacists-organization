import { NextFunction, Request, TypedResponse } from "express";
import Fee from "../../models/fee.model.js";
import { FeeDocument } from "../../types/models/fee.types.js";
import { responseMessages } from "../../translation/response.ar.js";
import { IUpdateFeesValuesDto } from "../../types/dtos/fee.dto.js";

const updateFeesValues = async (req: Request, res: TypedResponse<FeeDocument[]>, next: NextFunction) => {
    let result = [];
    const validatedData: IUpdateFeesValuesDto[] = req.validatedData;
    try {
        for (const feeObject of validatedData) {
            if (!feeObject.details && !feeObject.value) {
                res.status(400).json({
                    success: false,
                    details: [responseMessages.FEE_CONTROLLERS.MISSING_VALUE_DETAIL],
                });
                return;
            }
            const fee = await Fee.findById(feeObject.id);
            if (!fee) {
                res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
                return;
            }
            if (fee.name == "رسم السن" || fee.name == "المطبوعات") {
                res.status(400).json({ success: false, details: [responseMessages.FEE_CONTROLLERS.PROTECTED_FEES] });
                return;
            }
            if (fee.isMutable) {
                if (!feeObject.details) {
                    const oldDetails = fee.details;
                    oldDetails?.set(`${new Date().getFullYear()}`, feeObject.value!);
                    await fee.updateOne({
                        $set: {
                            details: oldDetails,
                        },
                    });
                } else {
                    await fee.updateOne({
                        $set: {
                            details: feeObject.details,
                        },
                    });
                }

                const doc = await Fee.findById(fee._id);
                result.push(doc!);
            } else {
                if (!feeObject.value) {
                    res.status(400).json({ success: false, details: [responseMessages.FEE_CONTROLLERS.MISSING_VALUE] });
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
