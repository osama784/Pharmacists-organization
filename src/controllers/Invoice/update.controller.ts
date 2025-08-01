import Invoice, { invoiceStatuses } from "../../models/invoice.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { InvoiceDocument } from "../../types/models/invoice.types.js";
import { responseMessages } from "../../translation/response.ar.js";
import { InvoiceResponseDto, toInvoiceResponseDto, updateInvoiceDto } from "../../types/dtos/invoice.dto.js";
import { PharmacistDocument } from "../../types/models/pharmacist.types.js";
import Pharmacist from "../../models/pharmacist.model.js";

const updateInvoice = async (req: Request, res: TypedResponse<InvoiceResponseDto>, next: NextFunction) => {
    const validateData: updateInvoiceDto = req.validatedData;
    const status = validateData.status;

    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        let updatedFields: Record<string, any> = validateData;
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

        res.json({ success: true, data: toInvoiceResponseDto(doc!) });
        return;
    } catch (e) {
        next(e);
    }
};

export default updateInvoice;
