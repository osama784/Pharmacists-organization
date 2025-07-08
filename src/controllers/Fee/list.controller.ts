import { NextFunction, Request, TypedResponse } from "express";
import Fee from "../../models/fee.model.js";
import { FeeDocument, PopulatedFeeDocument } from "../../types/models/fee.types.js";
import { SectionDocument } from "../../types/models/section.types.js";
import Section from "../../models/section.model.js";

const listFees = async (req: Request, res: TypedResponse<Record<string, FeeDocument[]>>, next: NextFunction) => {
    const queryStatus = req.query.status;
    let fees = [];
    try {
        if (queryStatus == "mutable") {
            fees = await Fee.find({ isMutable: true }).populate<{ section: SectionDocument }>("section");
        } else if (queryStatus == "immutable") {
            fees = await Fee.find({ isMutable: false }).populate<{ section: SectionDocument }>("section");
        } else {
            fees = await Fee.find().populate<{ section: SectionDocument }>("section");
        }
        const result: Record<string, FeeDocument[]> = {};
        for (const fee of fees) {
            if (result[fee.section.name]) {
                result[fee.section.name].push(fee.depopulate("section"));
            } else {
                result[fee.section.name] = [fee.depopulate("section")];
            }
        }
        const sections = await Section.find();
        for (const section of sections) {
            if (!result[section.name]) {
                result[section.name] = [];
            }
        }
        res.json({
            success: true,
            data: result,
        });
    } catch (e) {
        next(e);
    }
};

export default listFees;
