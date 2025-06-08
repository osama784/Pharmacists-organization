import mongoose, { Schema } from "mongoose";

const PracticeType = new Schema({
    name: String,
    fees: {
        type: [Schema.Types.ObjectId],
        ref: "Fee",
    },
});

// "fees": related fees that the pharmacist should pay

export default mongoose.model("PracticeType", PracticeType, "practiceTypes");
