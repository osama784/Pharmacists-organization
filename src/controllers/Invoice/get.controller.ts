import Invoice from "../../models/invoice.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { InvoiceDocument } from "../../types/models/invoice.types.js";
import { responseMessages } from "../../translation/response.ar.js";

const getInvoice = async (req: Request, res: TypedResponse<InvoiceDocument>, next: NextFunction) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        res.json({ success: true, data: invoice });
    } catch (e) {
        next(e);
    }
};

export default getInvoice;
