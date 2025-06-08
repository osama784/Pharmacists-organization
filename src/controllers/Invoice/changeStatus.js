import Invoice, { invoiceStatuses } from "../../models/Invoice";

const changeInvoiceStatus = async (req, res, next) => {
    const status = req.query.status;
    if (!status || Object.values(invoiceStatuses).includes(status)) {
        res.status(400).send({ detail: "invalid invoice status" });
        return;
    }

    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            res.status(404).send({ detail: "invalid invoice id" });
            return;
        }
        let updatedFields = { status: status };
        if (status in [invoiceStatuses.cancelled, invoiceStatuses.ready]) {
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
        invoice.updateOne({ $set: { status: status } }, { new: true });

        res.status(200);
        return;
    } catch (e) {
        next(e);
    }
};

export default changeInvoiceStatus;
