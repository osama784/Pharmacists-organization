import mongoose, { Schema } from "mongoose";

export const invoiceStatuses = {
    paid: "مدفوع",
    ready: "جاهزة لللإرسال",
    cancelled: "ملغاة",
};

const Invoice = new Schema({
    pharmacist: { type: Schema.Types.ObjectId, ref: "Pharmacist" },
    status: String,
    practiceType: { type: Schema.Types.ObjectId, ref: "PracticeType" },
    isFinesIncluded: Boolean,
    fees: [
        {
            feeRef: {
                type: Schema.Types.ObjectId,
                ref: "Fee",
            },
            feeName: String,
            sectionName: String,
            value: Number,
        },
    ],
    total: Number,
    paidDate: Date,
    createdAt: Date,
});

Invoice.pre("save", async function () {
    if (this.isModified("fees")) {
        const doc = await this.populate("fees");
        this.total = doc.fees.reduce((sum, fee) => sum + fee.value, 0);
    }
});

export default mongoose.model("Invoice", Invoice, "invoices");
