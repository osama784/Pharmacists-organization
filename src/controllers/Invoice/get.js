import Invoice from "../../models/Invoice.js";

const getInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            res.status(404).json({ message: "no invoice found" });
            return;
        }
        res.status(200).json(invoice);
    } catch (e) {
        next(e);
    }
};

export default getInvoice;
