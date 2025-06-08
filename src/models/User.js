import mongoose, { Schema } from "mongoose";

const User = new Schema({
    username: String,
    password: String,
    role: Schema.Types.ObjectId,
});

export default mongoose.model("User", User, "users");
