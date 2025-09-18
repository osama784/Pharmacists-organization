import mongoose, { Schema } from "mongoose";
import { ITreasuryExpenditureModel, TreasuryExpenditureDocument } from "../types/models/treasuryExpenditure.types";
import Counter from "./counter.model";

const TreasuryExpenditure = new Schema<TreasuryExpenditureDocument>(
    {
        serialID: { type: String, required: true, unique: true, index: true },
        name: { type: String, required: true },
        value: { type: Number, required: true },
        associatedSection: { type: String, required: true },
        image: String,
    },
    { timestamps: true }
);

TreasuryExpenditure.pre("validate", async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findOneAndUpdate(
                { name: "treasuryExpenditure" },
                { $inc: { value: 1 } },
                { new: true, upsert: true }
            );
            this.serialID = counter.value.toString();
            next();
        } catch (e) {
            next(e as Error);
        }
    } else {
        next();
    }
});

export default mongoose.model<TreasuryExpenditureDocument, ITreasuryExpenditureModel>(
    "treasuryExpenditure",
    TreasuryExpenditure,
    "treasuryExpenditures"
);
