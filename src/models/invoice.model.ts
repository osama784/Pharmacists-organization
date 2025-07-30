import mongoose, { Schema } from "mongoose";
import { IInvoiceModel, InvoiceDocument } from "../types/models/invoice.types.js";

export const invoiceStatuses = {
    paid: "مدفوع",
    ready: "جاهزة لللإرسال",
    cancelled: "ملغاة",
};

const Invoice = new Schema<InvoiceDocument>({
    pharmacist: { type: Schema.Types.ObjectId, ref: "Pharmacist", required: true },
    status: String,
    syndicateMembership: { type: String, required: true },
    isFinesIncluded: Boolean,
    fees: [
        {
            _id: false,
            name: { type: String, required: true },
            value: { type: Number, required: true },
        },
    ],
    total: Number,
    paidDate: Date,
    createdAt: { type: Date, required: true },
});

Invoice.pre("save", async function () {
    if (this.isModified("fees")) {
        const doc = await this.populate("fees");
        this.total = doc.fees.reduce((sum, fee) => sum + fee.value, 0);
    }
});

export default mongoose.model<InvoiceDocument, IInvoiceModel>("Invoice", Invoice, "invoices");
