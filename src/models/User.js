import mongoose, { Schema } from "mongoose";

const User = new Schema({
    username: {
        type: String,
        unique: true,
    },
    password: String,
    role: {
        type: Schema.Types.ObjectId,
        ref: "Role",
    },
});

User.statics.checkUniqueUsername = async function (currentDocID, username) {
    let lookup = {};
    if (currentDocID) {
        lookup = {
            _id: {
                $ne: currentDocID,
            },
            username,
        };
    } else {
        lookup = { username };
    }
    const exists = await mongoose.model("User").exists(lookup);
    return exists;
};

export default mongoose.model("User", User, "users");
