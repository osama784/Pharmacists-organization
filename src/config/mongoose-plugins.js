import mongoose from "mongoose";

export const idTransformPlugin = (schema) => {
    const transform = function (doc, ret) {
        if (ret._id instanceof mongoose.Types.ObjectId) {
            ret.id = ret._id.toString();
            delete ret._id;
        }
        // Handle string _id (if already converted)
        else if (typeof ret._id === "string") {
            ret.id = ret._id;
            delete ret._id;
        }
        delete ret.__v;
    };
    schema.set("toJSON", {
        virtuals: true,
        transform,
    });
    schema.set("toObject", {
        virtuals: true,
        transform,
    });
};
