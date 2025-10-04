import { HydratedDocument, Model, Types } from "mongoose";
import { LeaseType } from "../../enums/lease.enums";
import { PharmacistDocument } from "./pharmacist.types";

export interface ILease {
    name: string;
    pharmacistOwner?: Types.ObjectId | PharmacistDocument;
    leaseType: LeaseType;
    // staffPharmacists: [Types.ObjectId];
    estatePlace: string;
    estateNum: string;
    startDate: Date;
    endDate?: Date;
    closedOut: boolean;
}

export interface ILeasePharmacy extends ILease {
    pharmacistOwner: Types.ObjectId;
}
export type LeaseDocument = HydratedDocument<ILease> & {
    createdAt: Date;
    updatedAt: Date;
};

export interface ILeaseModel extends Model<LeaseDocument> {
    isEstateNumAvailable: (estateNum: string, estatePlace: string) => Promise<boolean>;
}

export function isPharmacyLease(doc: ILease): doc is ILeasePharmacy {
    return doc.pharmacistOwner != undefined;
}
