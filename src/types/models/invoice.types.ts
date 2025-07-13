import mongoose, { HydratedDocument, Model, PopulatedDoc } from "mongoose";
import { PharmacistDocument } from "./pharmacist.types.js";

export interface IFeeInvoice {
    feeRef: mongoose.Types.ObjectId;
    feeName: string;
    sectionName: string;
    value: number;
}

export interface IInvoice {
    pharmacist: mongoose.Types.ObjectId;
    status?: string;
    syndicateMembership: string;
    isFinesIncluded?: boolean;
    fees: IFeeInvoice[];
    total: number;
    paidDate?: Date;
    createdAt: Date;
}

export type InvoiceDocument = HydratedDocument<IInvoice>;
export type PopulatedInvoiceDocument = Omit<InvoiceDocument, "pharmacist"> & {
    pharmacist: PharmacistDocument;
};

export interface IInvoiceModel extends Model<InvoiceDocument> {}
