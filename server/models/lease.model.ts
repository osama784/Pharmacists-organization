import mongoose, { Schema, Types } from "mongoose";
import { ILease, ILeaseModel, LeaseDocument } from "../types/models/lease.types";

const leaseSchema = new Schema<LeaseDocument>(
    {
        pharmacistOwner: { type: Schema.Types.ObjectId, ref: "Pharmacist", required: true },
        staffPharmacists: [{ type: Types.ObjectId, ref: "Pharmacist" }],
        estatePlace: { type: String, required: true },
        estateNum: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: Date,
        closedOut: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const leaseModel = mongoose.model("Lease", leaseSchema, "leases");
