import Invoice, { invoiceStatuses } from "../../models/invoice.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { InvoiceDocument } from "../../types/models/invoice.types.js";
import { responseMessages } from "../../translation/response.ar.js";

const updateInvoiceStatus = async (req: Request, res: TypedResponse<InvoiceDocument>, next: NextFunction) => {
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
        if ([invoiceStatuses.cancelled, invoiceStatuses.ready].includes(status)) {
            updatedFields = {
                status: status,
                paidDate: null,
            };
        }

        if (status == invoiceStatuses.paid) {
            updatedFields = {
                status: status,
                paidDate: new Date(),
            };
        }
        await invoice.updateOne({ $set: updatedFields });
        const doc = await Invoice.findById(invoice._id);

        res.json({ success: true, data: doc! });
        return;
    } catch (e) {
        next(e);
    }
};

export default updateInvoiceStatus;
