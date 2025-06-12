import mongoose, { Schema } from "mongoose";

const Role = new Schema({
    name: { type: String, unique: true },
    permissions: [String],
});

Role.statics.checkUniqueName = async function (name) {
    const exists = await mongoose.model("Role").exists({ name });
    return exists;
};

export default mongoose.model("Role", Role, "roles");
