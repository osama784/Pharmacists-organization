import Invoice from "../../models/Invoice.js";

const updateInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            res.status(404);
            return;
        }
        invoice.fees = req.validatedDate;

        const doc = await invoice.save();
        res.status(200).json(doc);
    } catch (e) {
        next(e);
    }
};

export default updateInvoice;
