import { NextFunction, Request, TypedResponse } from "express";
import Fee from "../../models/fee.model.js";
import { responseMessages } from "../../translation/response.ar.js";
import { FeeResponseDto, IUpdateFeesValuesDto, toFeeResponseDto } from "../../types/dtos/fee.dto.js";
import { SectionDocument } from "../../types/models/section.types.js";
import Section from "../../models/section.model.js";
import mongoose from "mongoose";

const updateFeesValues = async (req: Request, res: TypedResponse<Record<string, FeeResponseDto[]>>, next: NextFunction) => {
    let result: Record<string, FeeResponseDto[]> = {};
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
            if (fee.isMutable) {
                if (!feeObject.details) {
                    // set the sent value to the currentYear
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
            }
        }
        for (const fee of await Fee.find().populate<{ section: SectionDocument }>("section")) {
            if (result[fee.section.name]) {
                result[fee.section.name].push(toFeeResponseDto(fee.depopulate<{ section: mongoose.Types.ObjectId }>("section")));
            } else {
                result[fee.section.name] = [toFeeResponseDto(fee.depopulate<{ section: mongoose.Types.ObjectId }>("section"))];
            }
        }
        const sections = await Section.find();
        for (const section of sections) {
            if (!result[section.name]) {
                result[section.name] = [];
            }
        }

        res.json({ success: true, data: result });
    } catch (e) {
        next(e);
    }
};

export default updateFeesValues;
