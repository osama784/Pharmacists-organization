import mongoose, { Schema } from "mongoose";
import { ITreasuryStampModel, TreasuryStampDocument } from "../types/models/treasuryStamp.types";
import Counter from "./counter.model";

const TreasuryStamp = new Schema<TreasuryStampDocument>(
    {
        serialID: { type: String, unique: true, index: true, required: true },
        name: { type: String, required: true },
        value: { type: Number, required: true },
        initialQuantity: { type: Number, required: true },
        soldQuantity: { type: Number, required: true, default: 0 },
    },
    { timestamps: true }
);

TreasuryStamp.pre("validate", async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findOneAndUpdate({ name: "treasuryStamp" }, { $inc: { value: 1 } }, { new: true, upsert: true });
            this.serialID = counter.value.toString();
            next();
        } catch (e) {
            next(e as Error);
        }
    } else {
        next();
    }
});

export default mongoose.model<TreasuryStampDocument, ITreasuryStampModel>("treasuryStamp", TreasuryStamp, "treasuryStamps");
