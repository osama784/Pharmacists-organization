import Invoice from "../../models/Invoice.js";

const getInvoice = async (req, res, next) => {
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
