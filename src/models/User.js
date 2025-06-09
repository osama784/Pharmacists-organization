import mongoose, { Schema } from "mongoose";

const User = new Schema({
    username: String,
    password: String,
    role: {
        type: Schema.Types.ObjectId,
        ref: "Role",
    },
});

export default mongoose.model("User", User, "users");
