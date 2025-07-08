import { NextFunction, Request, TypedResponse } from "express";
import Invoice from "../../models/invoice.model.js";
import Section from "../../models/section.model.js";
import { InvoiceDocument } from "../../types/models/invoice.types.js";
import { createInvoiceDto } from "../../types/dtos/invoice.dto.js";
import { FeeDocument } from "../../types/models/fee.types.js";
import staticData from "../../config/static-data.json";

const createInvoice = async (req: Request, res: TypedResponse<InvoiceDocument>, next: NextFunction) => {
    try {
        // check fines date, adding fines
        const validatedData: createInvoiceDto = req.validatedData;
        const fees = validatedData.fees;
        const finesDate = new Date(staticData["fines-date"]);

        const sections = await Section.find().populate<{
            fineableFees: FeeDocument[];
            fineSummaryFee: FeeDocument;
        }>("fineableFees fineSummaryFee");

        let fineSummaryFeeValue = 0;
        let currentFee = null;
        let isFinesIncluded = false;
        if (new Date() >= finesDate) {
            isFinesIncluded = true;
            sections.forEach((section) => {
                section.fineableFees.forEach((fee) => {
                    currentFee = fees.filter((obj) => obj.feeRef == fee._id)[0];
                    fineSummaryFeeValue += (currentFee.value * 25) / 100;
                });
                fees.push({
                    feeRef: section.fineSummaryFee._id,
                    feeName: section.fineSummaryFee.name,
                    sectionName: section.name,
                    value: fineSummaryFeeValue,
                });
                fineSummaryFeeValue = 0;
            });
        } else {
            sections.forEach((section) => {
                fees.push({
                    feeRef: section.fineSummaryFee._id,
                    feeName: section.fineSummaryFee.name,
                    sectionName: section.name,
                    value: 0,
                });
            });
        }

        const invoice = await Invoice.create({ ...req.validatedData, fees, isFinesIncluded });
        res.json({ success: true, data: invoice });
    } catch (e) {
        next(e);
    }
};

export default createInvoice;
