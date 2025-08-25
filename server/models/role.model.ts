import mongoose, { FilterQuery, Query, Schema } from "mongoose";
import User from "./user.model.js";
import { IRoleModel, RoleDocument } from "../types/models/role.types.js";

const Role = new Schema<RoleDocument>(
    {
        name: { type: String, unique: true, required: true },
        permissions: {
            type: [String],
            required: true,
        },
    },
    { timestamps: true }
);

Role.statics.checkUniqueName = async function (name: string): Promise<boolean> {
    const exists = await mongoose.model("Role").exists({ name });
    if (exists) {
        return true;
    }
    return false;
};

async function preDeleteLogic(doc: RoleDocument) {
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

Role.pre("deleteOne", { document: true, query: false }, async function (this: RoleDocument) {
    await preDeleteLogic(this);
});
Role.pre("deleteOne", { document: false, query: true }, async function (this: Query<any, RoleDocument>) {
    const model = this.model as IRoleModel;
    const filter = this.getFilter() as FilterQuery<RoleDocument>;

    const doc = await model.findOne(filter);
    if (doc) {
        await preDeleteLogic(doc);
    }
});

Role.pre("findOneAndDelete", { document: true, query: true }, async function (this: Query<any, RoleDocument>) {
    const model = this.model as IRoleModel;

    const filter = this.getFilter() as FilterQuery<RoleDocument>;

    const doc = await model.findOne(filter);
    if (doc) {
        await preDeleteLogic(doc);
    }
});

export default mongoose.model<RoleDocument, IRoleModel>("Role", Role, "roles");
