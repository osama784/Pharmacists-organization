import mongoose, { Schema } from "mongoose";
import { ISectionModel, SectionDocument } from "../types/models/section.types.js";

const Section = new Schema<SectionDocument>({
    name: { type: String, required: true },
    fees: [{ type: Schema.Types.ObjectId, ref: "Fee" }],
    fineableFees: [{ type: Schema.Types.ObjectId, ref: "Fee" }],
    fineSummaryFee: {
        type: Schema.Types.ObjectId,
        ref: "Fee",
    },
});

export default mongoose.model<SectionDocument, ISectionModel>("Section", Section, "sections");

// this enum not for depending on it, but for making the process of validation easier,
// and connection between models and Section model is important because of any change in section info
export enum SectionsEnum {
    SYNDICATE = "صندوق النقابة",
    RETIREMENT = "خزانة التقاعد",
    DISABILITY = "صندوق إعانة العجز و الوفاة",
    HEALTH = "خزانة التكافل الصحي",
}
