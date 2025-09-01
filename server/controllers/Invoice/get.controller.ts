import Invoice from "../../models/invoice.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { InvoiceDocument } from "../../types/models/invoice.types.js";
import { responseMessages } from "../../translation/response.ar.js";
import { InvoiceResponseDto, toInvoiceResponseDto } from "../../types/dtos/invoice.dto.js";
import { PharmacistDocument } from "../../types/models/pharmacist.types.js";
import Section from "../../models/section.model.js";
import { FeeDocument } from "../../types/models/fee.types.js";
import { BankDocument } from "../../types/models/bank.types.js";

const getInvoice = async (
    req: Request,
    res: TypedResponse<Omit<InvoiceResponseDto, "fees"> & { fees: Record<string, any> }>,
    next: NextFunction
) => {
    try {
        const invoice = await Invoice.findOne({ serialID: req.params.id }).populate<{ pharmacist: PharmacistDocument; bank: BankDocument }>(
            "pharmacist bank"
        );

        if (!invoice) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        let serializedDoc = toInvoiceResponseDto(invoice);
        let serializedFees: Record<string, any> = {};
        const sections = await Section.find().populate<{ fees: FeeDocument[] }>("fees");

        for (const section of sections) {
            let sectionTotalFeesValue = 0;
            const sectionFees = section.fees.map((fee) => {
                const currentFee = serializedDoc.fees?.find((element) => element.name == fee.name);
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
    } catch (e) {
        next(e);
    }
};

export default getInvoice;
