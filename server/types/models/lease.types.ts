import { HydratedDocument, Model, Types } from "mongoose";

export interface ILease {
    pharmacistOwner: Types.ObjectId;
    staffPharmacists: [Types.ObjectId];
    estatePlace: string;
    estateNum: string;
    startDate: Date;
    endDate?: Date;
    closedOut: boolean;
}
export type LeaseDocument = HydratedDocument<ILease> & {
    createdAt: Date;
    updatedAt: Date;
};

export interface ILeaseModel extends Model<LeaseDocument> {}
