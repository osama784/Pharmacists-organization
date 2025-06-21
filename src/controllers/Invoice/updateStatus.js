import Invoice, { invoiceStatuses } from "../../models/Invoice.js";

const updateInvoiceStatus = async (req, res, next) => {
    const status = req.body.status;
    if (!status || !Object.values(invoiceStatuses).includes(status)) {
        res.status(400).json({ success: false, message: "invalid invoice status" });
        return;
    }

    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            res.status(404).json({ success: false });
            return;
        }
        let updatedFields = { status };
        if ([invoiceStatuses.cancelled, invoiceStatuses.ready].includes(status)) {
            updatedFields = {
                status: status,
                paidDate: null,
            };
        }

        if (status == invoiceStatuses.paid) {
            updatedFields = {
                status: status,
                paidDate: new Date(),
            };
        }
        await invoice.updateOne({ $set: updatedFields });
        const doc = await Invoice.findById(invoice._id);

        res.json({ success: true, data: doc });
        return;
    } catch (e) {
        next(e);
    }
};

export default updateInvoiceStatus;
