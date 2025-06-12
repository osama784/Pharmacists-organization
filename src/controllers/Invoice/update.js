import Invoice from "../../models/Invoice.js";

const updateInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            res.sendStatus(404);
            return;
        }

        await invoice.updateOne({ $set: { fees: req.validatedData } });
        const doc = await Invoice.findById(invoice._id);
        res.status(200).json(doc);
    } catch (e) {
        next(e);
    }
};

export default updateInvoice;
