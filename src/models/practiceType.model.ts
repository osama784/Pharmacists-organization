import mongoose, { Schema } from "mongoose";
import { IPracticeTypeModel, PracticeTypeDocument } from "../types/models/practiceType.types.js";

const PracticeType = new Schema<PracticeTypeDocument>({
    name: String,
    fees: {
        type: [Schema.Types.ObjectId],
        ref: "Fee",
    },
});

export const practiceTypes: string[] = [
    "انتساب",
    "انتساب أجانب",
    "سنة مزاول",
    "سنة غير مزاول",
    "سنتين مزاول",
    "سنتين غير مزاول",
    "إعادة قيد مزاول",
    "إعادة قيد غير مزاول",
];

export default mongoose.model<PracticeTypeDocument, IPracticeTypeModel>("PracticeType", PracticeType, "practiceTypes");
