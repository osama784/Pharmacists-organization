import mongoose, { Schema } from "mongoose";
import { StringSchema } from "../utils/customSchemas";
import { TreasuryFeeTR } from "../translation/models.ar";
import { ITreasuryFeeModel, TreasuryFeeDocument } from "../types/models/treasuryFee.types";

const TreasuryFee = new Schema<TreasuryFeeDocument>(
    {
        name: { type: String, required: true },
        value: { type: Number, required: true },
        associatedParty: String,
        associatedSection: { type: Schema.Types.ObjectId, ref: "Section", required: true },
        receiptBook: { type: String, required: true },
    },
    { timestamps: true }
);

export const PARTIES = ["الذاتية", "الديوان", "مستودع المطبوعات"];
export const RECEIPT_BOOKS = ["تسوية", "وثائق", "مطبوعات"];
export default mongoose.model<TreasuryFeeDocument, ITreasuryFeeModel>("TreasuryFee", TreasuryFee, "treasuryFees");
