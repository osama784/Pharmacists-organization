import Invoice from "../../models/Invoice.js";

const deleteInvoice = async (req, res, next) => {
    try {
        const result = await Invoice.deleteOne({ _id: req.params.id });
        if (result.deletedCount != 1) {
            res.status(404);
            return;
        }
        res.status(204);
    } catch (e) {
        next(e);
    }
};

export default deleteInvoice;
