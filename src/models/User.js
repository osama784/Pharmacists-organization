import mongoose, { Schema } from "mongoose";

const User = new Schema({
    username: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    phoneNumber: String,
    role: {
        type: Schema.Types.ObjectId,
        ref: "Role",
    },
});

User.path("password").select(false);

User.statics.checkUniqueEmail = async function (currentDocID, email) {
    let lookup = {};
    if (currentDocID) {
        lookup = {
            _id: {
                $ne: currentDocID,
            },
            email,
        };
    } else {
        lookup = { email };
    }
    const exists = await mongoose.model("User").exists(lookup);
    return exists;
};

export default mongoose.model("User", User, "users");
