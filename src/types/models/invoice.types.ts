import mongoose, { HydratedDocument, Model, PopulatedDoc } from "mongoose";
import { PharmacistDocument } from "./pharmacist.types.js";

export interface IInvoice {
    serialID: string;
    pharmacist: mongoose.Types.ObjectId;
    status: string;
    syndicateMembership: string;
    isFinesIncluded?: boolean;
    fees: { name: string; value: number; numOfYears: number }[];
    total: number;
    paidDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export type InvoiceDocument = HydratedDocument<IInvoice>;
export type PopulatedInvoiceDocument = Omit<InvoiceDocument, "pharmacist"> & {
    pharmacist: PharmacistDocument;
};

export interface IInvoiceModel extends Model<InvoiceDocument> {}
