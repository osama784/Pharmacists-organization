import Invoice from "../../models/invoice.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { InvoiceDocument } from "../../types/models/invoice.types.js";

const getInvoice = async (req: Request, res: TypedResponse<InvoiceDocument>, next: NextFunction) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            res.status(404).json({ success: false });
            return;
        }
        res.json({ success: true, data: invoice });
    } catch (e) {
        next(e);
    }
};

export default getInvoice;
