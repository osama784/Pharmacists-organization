import { NextFunction, Request, TypedResponse } from "express";
import Invoice, { getPharmacistRelatedFees } from "../../models/invoice.model.js";
import { createInvoiceDto, InvoiceResponseDto, toInvoiceResponseDto } from "../../types/dtos/invoice.dto.js";
import staticData from "../../config/static-data.json";
import Pharmacist from "../../models/pharmacist.model.js";
import { responseMessages } from "../../translation/response.ar.js";
import { PharmacistDocument } from "../../types/models/pharmacist.types.js";

const createInvoice = async (req: Request, res: TypedResponse<InvoiceResponseDto>, next: NextFunction) => {
    try {
        // check fines date, adding fines
        const validatedData: createInvoiceDto = req.validatedData;
        const finesDate = new Date(staticData["fines-date"]);

        const pharmacist = await Pharmacist.findById(req.params.id);
        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        const fees = await getPharmacistRelatedFees(validatedData, pharmacist);
        const total = fees.reduce((sum, fee) => sum + fee.value, 0);
        let isFinesIncluded = false;
        if (new Date() >= finesDate) {
            isFinesIncluded = true;
        }

        const invoice = await (
            await Invoice.create({ ...req.validatedData, fees, isFinesIncluded, pharmacist, total })
        ).populate<{ pharmacist: PharmacistDocument }>("pharmacist");
        res.json({ success: true, data: toInvoiceResponseDto(invoice) });
    } catch (e) {
        next(e);
    }
};

export default createInvoice;
