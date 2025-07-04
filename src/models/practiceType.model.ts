import mongoose, { Schema } from "mongoose";
import { IPracticeTypeModel, PracticeTypeDocument } from "../types/models/practiceType.types.js";

const PracticeType = new Schema<PracticeTypeDocument>({
    name: String,
    fees: {
        type: [Schema.Types.ObjectId],
        ref: "Fee",
    },
});

// "fees": related fees that the pharmacist should pay

export default mongoose.model<PracticeTypeDocument, IPracticeTypeModel>("PracticeType", PracticeType, "practiceTypes");
