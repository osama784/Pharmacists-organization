import mongoose, { HydratedDocument, Model, PopulatedDoc } from "mongoose";
import { PharmacistDocument } from "./pharmacist.types.js";
import { BankDocument } from "./bank.types.js";

export interface IInvoice {
    serialID: string;
    receiptNumber?: string;
    pharmacist: mongoose.Types.ObjectId;
    bank: mongoose.Types.ObjectId;
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
export type PopulatedInvoiceDocument = Omit<InvoiceDocument, "pharmacist" | "bank"> & {
    pharmacist: PharmacistDocument;
    bank: BankDocument;
};

export interface IInvoiceModel extends Model<InvoiceDocument> {}
