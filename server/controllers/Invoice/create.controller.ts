import { NextFunction, Request, TypedResponse } from "express";
import Invoice, { getPharmacistRelatedFees, invoiceStatuses } from "../../models/invoice.model.js";
import { createInvoiceDto, InvoiceResponseDto, toInvoiceResponseDto } from "../../types/dtos/invoice.dto.js";
import staticData from "../../config/static-data.json";
import Pharmacist from "../../models/pharmacist.model.js";
import { responseMessages } from "../../translation/response.ar.js";
import { PharmacistDocument } from "../../types/models/pharmacist.types.js";
import Section from "../../models/section.model.js";
import { FeeDocument } from "../../types/models/fee.types.js";
import Bank from "../../models/bank.model.js";
import { InvoiceModelTR } from "../../translation/models.ar.js";
import { PopulatedInvoiceDocument } from "../../types/models/invoice.types.js";

const createInvoice = async (
    req: Request,
    res: TypedResponse<Omit<InvoiceResponseDto, "fees"> & { fees: Record<string, any> }>,
    next: NextFunction
) => {
    try {
        // check fines date, adding fines
        const validatedData: createInvoiceDto = req.validatedData;
        const finesDate = new Date(staticData["fines-date"]);

        const pharmacist = await Pharmacist.findById(req.params.pharmacistID);
        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        const bank = await Bank.findById(validatedData.bank);
        if (!bank) {
            res.status(400).json({ success: false, details: [`${InvoiceModelTR.bank}: ${responseMessages.NOT_FOUND}`] });
            return;
        }
        const fees = await getPharmacistRelatedFees(validatedData, pharmacist);
        const total = fees.reduce((sum, fee) => sum + fee.value, 0);
        let isFinesIncluded = false;
        if (new Date() >= finesDate && validatedData.calculateFines != undefined && validatedData.calculateFines == true) {
            isFinesIncluded = true;
        }

        const invoice: PopulatedInvoiceDocument = await (
            await Invoice.create({
                ...req.validatedData,
                fees,
                isFinesIncluded,
                pharmacist,
                total,
                status: invoiceStatuses.ready,
                updatedAt: Date.now(),
            })
        ).populate("pharmacist bank");
        let serializedDoc = toInvoiceResponseDto(invoice);
        const sections = await Section.find().populate<{ fees: FeeDocument[] }>("fees");
        let serializedFees: Record<string, any> = {};

        for (const section of sections) {
            let sectionTotalFeesValue = 0;
            const sectionFees = section.fees.map((fee) => {
                const currentFee = fees.find((element) => element.name == fee.name);
                if (!currentFee) {
                    return;
                }
                sectionTotalFeesValue += Number(currentFee.value);
                return {
                    name: fee.name,
                    value: currentFee.value,
                    numOfYears: currentFee.numOfYears,
                };
            });
            serializedFees[section.name] = {};
            serializedFees[section.name]["fees"] = sectionFees;
            serializedFees[section.name]["total"] = sectionTotalFeesValue;
        }

        res.json({ success: true, data: { ...serializedDoc, fees: serializedFees } });
    } catch (e) {
        next(e);
    }
};

export default createInvoice;
