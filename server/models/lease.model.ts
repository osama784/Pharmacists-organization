import mongoose, { Schema, Types } from "mongoose";
import { ILeaseModel, LeaseDocument } from "../types/models/lease.types";

const leaseSchema = new Schema<LeaseDocument>(
    {
        name: { type: String, required: true },
        pharmacistOwner: { type: Schema.Types.ObjectId, ref: "Pharmacist", required: true },
        // staffPharmacists: [{ type: Types.ObjectId, ref: "Pharmacist" }],
        estatePlace: { type: String, required: true },
        estateNum: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: Date,
        closedOut: { type: Boolean, default: false },
    },
    { timestamps: true }
);

leaseSchema.statics.isEstateNumAvailable = async function (estateNum: string, estatePlace: string): Promise<boolean> {
    const exist = await this.exists({ estateNum, estatePlace, closedOut: false });
    return exist ? false : true;
};

export default mongoose.model<LeaseDocument, ILeaseModel>("Lease", leaseSchema, "leases");
