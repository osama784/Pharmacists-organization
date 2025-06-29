import mongoose, { Schema } from "mongoose";

const Section = new Schema({
    name: String,
    fees: [{ type: Schema.Types.ObjectId, ref: "Fee" }],
    fineableFees: [{ type: Schema.Types.ObjectId, ref: "Fee" }],
    fineSummaryFee: {
        type: Schema.Types.ObjectId,
        ref: "Fee",
    },
});

export default mongoose.model("Section", Section, "sections");
