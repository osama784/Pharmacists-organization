import { NextFunction, Request, TypedResponse } from "express";
import Invoice from "../../models/invoice.model.js";

const deleteInvoice = async (req: Request, res: TypedResponse<null>, next: NextFunction) => {
    try {
        const result = await Invoice.deleteOne({ _id: req.params.id });
        if (result.deletedCount != 1) {
            res.status(404).json({ success: false });
            return;
        }
        res.sendStatus(204);
    } catch (e) {
        next(e);
    }
};

export default deleteInvoice;
