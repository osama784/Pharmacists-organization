import Invoice, { invoiceStatuses } from "../../models/invoice.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { InvoiceDocument } from "../../types/models/invoice.types.js";
import { responseMessages } from "../../translation/response.ar.js";
import { InvoiceResponseDto, toInvoiceResponseDto } from "../../types/dtos/invoice.dto.js";
import { PharmacistDocument } from "../../types/models/pharmacist.types.js";
import Pharmacist from "../../models/pharmacist.model.js";

const updateInvoiceStatus = async (req: Request, res: TypedResponse<InvoiceResponseDto>, next: NextFunction) => {
    const status = req.body.status;
    if (!status || !Object.values(invoiceStatuses).includes(status)) {
        res.status(400).json({ success: false, details: [responseMessages.INVOICE_CONTROLLERS.INVALID_STATUS] });
        return;
    }

    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        let updatedFields: Record<string, any> = { status };
        if (status == invoiceStatuses.paid) {
            updatedFields = {
                status: status,
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
                status: status,
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

export default updateInvoiceStatus;
