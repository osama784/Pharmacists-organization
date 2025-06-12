import Invoice from "../../models/Invoice.js";

const deleteInvoice = async (req, res, next) => {
    try {
        const result = await Invoice.deleteOne({ _id: req.params.id });
        if (result.deletedCount != 1) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    } catch (e) {
        next(e);
    }
};

export default deleteInvoice;
