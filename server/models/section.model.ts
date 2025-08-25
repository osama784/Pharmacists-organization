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
