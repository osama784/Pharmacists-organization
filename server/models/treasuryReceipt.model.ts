import mongoose, { Schema } from "mongoose";
import { ITreasuryReceiptModel, TreasuryReceiptDocument as TreasuryReceiptDocument } from "../types/models/treasuryReceipt.types";
import Counter from "./counter.model";
import { RECEIPT_BOOKS } from "./treasuryFee.model";

const TreasuryReceipt = new Schema<TreasuryReceiptDocument>(
    {
        serialID: { type: String, required: true, unique: true, index: true },
        pharmacist: { type: Schema.Types.ObjectId, ref: "Pharmacist", required: true },
        receiptBook: { type: String, required: true },
        fees: [
            {
                _id: false,
                name: String,
                value: Number,
            },
        ],
        total: Number,
    },
    { timestamps: true }
);

TreasuryReceipt.pre("validate", async function (next) {
    if (this.isNew) {
        try {
            let serialID = "";
            if (this.receiptBook == RECEIPT_BOOKS.Documents) {
                const counter = await Counter.findOneAndUpdate(
                    { name: "treasuryReceipt:documents" },
                    { $inc: { value: 1 } },
                    { new: true, upsert: true }
                );
                serialID = `D${counter.value.toString()}`;
            } else if (this.receiptBook == RECEIPT_BOOKS.Prints) {
                const counter = await Counter.findOneAndUpdate(
                    { name: "treasuryReceipt:prints" },
                    { $inc: { value: 1 } },
                    { new: true, upsert: true }
                );
                serialID = `P${counter.value.toString()}`;
            } else if (this.receiptBook == RECEIPT_BOOKS.Settlement) {
                const counter = await Counter.findOneAndUpdate(
                    { name: "treasuryReceipt:settlement" },
                    { $inc: { value: 1 } },
                    { new: true, upsert: true }
                );
                serialID = `S${counter.value.toString()}`;
            }
            this.serialID = serialID;
            next();
        } catch (e) {
            next(e as Error);
        }
    } else {
        next();
    }
});

export default mongoose.model<TreasuryReceiptDocument, ITreasuryReceiptModel>("treasuryReceipt", TreasuryReceipt, "treasuryReceipts");
