import mongoose, { Schema } from "mongoose";
import { StringSchema } from "../utils/customSchemas";
import { TreasuryFeeModelTR } from "../translation/models.ar";
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

export enum PARTIES {
    Credentialing = "الذاتية",
    RegistryOffice = "الديوان",
    PrintsRepository = "مستودع المطبوعات",
}

export enum RECEIPT_BOOKS {
    Prints = "مطبوعات",
    Documents = "وثائق",
    Settlement = "تسوية",
}

export default mongoose.model<TreasuryFeeDocument, ITreasuryFeeModel>("TreasuryFee", TreasuryFee, "treasuryFees");

export enum TREASURY_SECTIONS {
    SYNDICATE = "صندوق النقابة",
    RETIREMENT = "خزانة التقاعد",
    DISABILITY = "صندوق إعانة العجز و الوفاة",
    HEALTH = "خزانة التكافل الصحي",
    SUPPORT = "صندوق الدعم",
}
