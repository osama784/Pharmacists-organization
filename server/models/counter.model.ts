import mongoose from "mongoose";

const Counter = new mongoose.Schema({
    name: { type: String, required: true, unique: true, index: true },
    value: { type: Number, default: 0 },
});

export default mongoose.model("Counter", Counter);
