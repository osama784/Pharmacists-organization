import mongoose, { Schema } from "mongoose";

const RoleSchema = new Schema({
    name: { type: String, unique: true },
    permissions: [String],
});

export default mongoose.model("Role", RoleSchema, "roles");
