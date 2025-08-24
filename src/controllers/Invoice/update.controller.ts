import Invoice, { invoiceStatuses } from "../../models/invoice.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { responseMessages } from "../../translation/response.ar.js";
import { InvoiceResponseDto, toInvoiceResponseDto, updateInvoiceDto } from "../../types/dtos/invoice.dto.js";
import { PharmacistDocument } from "../../types/models/pharmacist.types.js";
import Pharmacist from "../../models/pharmacist.model.js";
import Section from "../../models/section.model.js";
import { FeeDocument } from "../../types/models/fee.types.js";

const updateInvoice = async (
    req: Request,
    res: TypedResponse<Omit<InvoiceResponseDto, "fees"> & { fees: Record<string, any> }>,
    next: NextFunction
) => {
    const validateData: updateInvoiceDto = req.validatedData;
    const status = validateData.status;

    try {
        const invoice = await Invoice.findOne({ serialID: req.params.id });
        if (!invoice) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        let updatedFields: Record<string, any> = { ...validateData, updatedAt: Date.now() };
        // update "total" filed if "fees" field gets changed
        if (validateData.fees) {
            const total = validateData.fees.reduce((sum, fee) => sum + Number(fee.value), 0);
            updatedFields = {
                ...updatedFields,
                total: total,
            };
        }

        if (status == invoiceStatuses.paid) {
            updatedFields = {
                ...updatedFields,
                paidDate: invoice.createdAt,
            };
            // updating "lastTimePaid" for the related pharmacist
            await Pharmacist.updateOne(
                { _id: invoice.pharmacist },
                {
                    lastTimePaid: invoice.createdAt,
                }
            );
        } else {
            updatedFields = {
                ...updatedFields,
                paidDate: null,
            };
        }

        await invoice.updateOne({ $set: updatedFields });

        const doc = await Invoice.findById(invoice._id).populate<{ pharmacist: PharmacistDocument }>("pharmacist");
        let serializedDoc = toInvoiceResponseDto(doc!);
        const sections = await Section.find().populate<{ fees: FeeDocument[] }>("fees");
        let serializedFees: Record<string, any> = {};

        for (const section of sections) {
            let sectionTotalFeesValue = 0;
            const sectionFees = section.fees.map((fee) => {
                const currentFee = serializedDoc.fees!.find((element) => element.name == fee.name);
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
            serializedFees[section.name]["fees"] = sectionFees.sort((a, b) => a?.name!.localeCompare(b?.name!)!);
            serializedFees[section.name]["total"] = sectionTotalFeesValue;
        }

        res.json({ success: true, data: { ...serializedDoc, fees: serializedFees } });
        return;
    } catch (e) {
        next(e);
    }
};

export default updateInvoice;
