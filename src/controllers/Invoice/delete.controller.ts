import { NextFunction, Request, TypedResponse } from "express";
import Invoice from "../../models/invoice.model.js";
import { responseMessages } from "../../translation/response.ar.js";

const deleteInvoice = async (req: Request, res: TypedResponse<null>, next: NextFunction) => {
    try {
        const result = await Invoice.deleteOne({ _id: req.params.id });
        if (result.deletedCount != 1) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        res.sendStatus(204);
    } catch (e) {
        next(e);
    }
};

export default deleteInvoice;
