import mongoose, { Schema } from "mongoose";
import User from "./User.js";

const Role = new Schema({
    name: { type: String, unique: true, required: true },
    permissions: [String],
});

Role.statics.checkUniqueName = async function (name) {
    const exists = await mongoose.model("Role").exists({ name });
    return exists;
};

async function preDeleteLogic(doc) {
    let EMPTY_ROLE = await doc.model().findOne({ name: "EMPTY" });
    if (!EMPTY_ROLE) {
        EMPTY_ROLE = await doc.model().create({
            name: "EMPTY",
            permissions: [],
        });
    }
    await User.updateMany(
        {
            role: doc._id,
        },
        {
            role: EMPTY_ROLE._id,
        }
    );
}

Role.pre("deleteOne", { document: true, query: false }, async function () {
    await preDeleteLogic(this);
});
Role.pre("deleteOne", { document: false, query: true }, async function () {
    const doc = await this.model.findOne(this.getFilter());
    if (doc) {
        await preDeleteLogic(doc);
    }
});

Role.pre("findOneAndDelete", { document: true, query: true }, async function () {
    const doc = await this.model.findOne(this.getFilter());
    if (doc) {
        await preDeleteLogic(doc);
    }
});

export default mongoose.model("Role", Role, "roles");
