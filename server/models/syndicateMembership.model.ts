import mongoose, { Schema } from "mongoose";
import { ISyndicateMemberShipModel, SyndicateMemberShipDocument } from "../types/models/syndicateMembership.types.js";

const SyndicateMembership = new Schema<SyndicateMemberShipDocument>({
    name: String,
    fees: {
        type: [Schema.Types.ObjectId],
        ref: "Fee",
    },
});

export const syndicateMemberships: string[] = [
    "انتساب",
    "انتساب أجانب",
    "سنة مزاول",
    "سنة غير مزاول",
    "سنتين مزاول",
    "سنتين غير مزاول",
    "إعادة قيد مزاول",
    "إعادة قيد غير مزاول",
];

export default mongoose.model<SyndicateMemberShipDocument, ISyndicateMemberShipModel>(
    "SyndicateMembership",
    SyndicateMembership,
    "syndicateMemberships"
);
