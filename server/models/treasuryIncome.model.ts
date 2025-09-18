import mongoose, { Schema } from "mongoose";
import Counter from "./counter.model";
import { ITreasuryIncomeModel, TreasuryIncomeDocument } from "../types/models/treasuryIncome.types";

const TreasuryIncome = new Schema<TreasuryIncomeDocument>(
    {
        serialID: { type: String, unique: true, index: true, required: true },
        name: { type: String, required: true },
        value: { type: Number, required: true },
        associatedSection: { type: String, required: true },
        image: String,
    },
    { timestamps: true }
);

TreasuryIncome.pre("validate", async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findOneAndUpdate({ name: "treasuryIncome" }, { $inc: { value: 1 } }, { new: true, upsert: true });
            this.serialID = counter.value.toString();
            next();
        } catch (e) {
            next(e as Error);
        }
    } else {
        next();
    }
});

export default mongoose.model<TreasuryIncomeDocument, ITreasuryIncomeModel>("treasuryIncome", TreasuryIncome, "treasuryIncomes");
