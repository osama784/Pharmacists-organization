import mongoose, { Schema } from "mongoose";

export const UserStatuses = {
    pending: "معلق",
    active: "مفعل",
    deleted: "محذوف",
};

const User = new Schema({
    username: { type: String, required: true },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: { type: String, required: true },
    resetPasswordToken: String,
    phoneNumber: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: Object.values(UserStatuses),
        default: UserStatuses.active,
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: "Role",
        required: true,
    },
});

User.path("password").select(false);
User.path("resetPasswordToken").select(false);

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

User.query.leanWithId = function () {
    return this.lean()
        .exec()
        .then((docs) =>
            docs.map((doc) => {
                const { _id, __v, ...rest } = doc;
                return { ...rest, id: _id.toString() };
            })
        );
};

export default mongoose.model("User", User, "users");
