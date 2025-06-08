import mongoose, { Schema } from "mongoose";

export const invoiceStatuses = {
    paid: "مدفوع",
    ready: "جاهزة لللإرسال",
    cancelled: "ملغاة",
};

const Invoice = new Schema({
    pharmacist: { type: Schema.Types.ObjectId, ref: "Pharmacist" },
    status: {
        type: String,
        default: invoiceStatuses.ready,
    },
    practiceType: { type: Schema.Types.ObjectId, ref: "PracticeType" },
    fees: [
        {
            _id: Schema.Types.ObjectId,
            section: String,
            name: String,
            value: Number,
        },
    ],
    paidDate: Date,
    createaAt: Date,
});

export default mongoose.model("Invoice", Invoice, "invoices");
