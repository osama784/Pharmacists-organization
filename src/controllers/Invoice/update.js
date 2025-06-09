import Invoice from "../../models/Invoice.js";

const updateInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            res.status(404);
            return;
        }
        const doc = await invoice.updateOne({ $set: req.validatedDate }, { new: true });

        res.status(200).json(doc);
    } catch (e) {
        next(e);
    }
};

export default updateInvoice;
