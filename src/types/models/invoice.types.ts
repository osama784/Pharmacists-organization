import mongoose, { HydratedDocument, Model, PopulatedDoc } from "mongoose";
import { PharmacistDocument } from "./pharmacist.types.js";

export interface IInvoice {
    pharmacist: mongoose.Types.ObjectId;
    status?: string;
    syndicateMembership: string;
    isFinesIncluded?: boolean;
    fees: { name: string; value: number }[];
    total: number;
    paidDate?: Date;
    createdAt: Date;
}

export type InvoiceDocument = HydratedDocument<IInvoice>;
export type PopulatedInvoiceDocument = Omit<InvoiceDocument, "pharmacist"> & {
    pharmacist: PharmacistDocument;
};

export interface IInvoiceModel extends Model<InvoiceDocument> {}
