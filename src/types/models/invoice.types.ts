import mongoose, { HydratedDocument, Model, PopulatedDoc } from "mongoose";
import { PharmacistDocument } from "./pharmacist.types.js";
import { PracticeTypeDocument } from "./practiceType.types.js";

export interface IFeeInvoice {
    feeRef: mongoose.Types.ObjectId;
    feeName: string;
    sectionName: string;
    value: number;
}

export interface IInvoice {
    pharmacist: mongoose.Types.ObjectId;
    status?: string;
    practiceType: mongoose.Types.ObjectId;
    isFinesIncluded?: boolean;
    fees: IFeeInvoice[];
    total: number;
    paidDate?: Date;
    createdAt: Date;
}

export type InvoiceDocument = HydratedDocument<IInvoice>;
export type PopulatedInvoiceDocument = Omit<InvoiceDocument, "pharmacist | practiceType"> & {
    pharmacist: PharmacistDocument;
    practiceType: PracticeTypeDocument;
};

// export type PopulatedInvoiceDocument = InvoiceDocument & {
//     pharmacist: PharmacistDocument;
//     practiceType: PracticeTypeDocument;
// };

export interface IInvoiceModel extends Model<InvoiceDocument> {}
