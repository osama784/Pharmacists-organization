import { HydratedDocument, Model, Types } from "mongoose";
import { RECEIPT_BOOKS } from "../../models/treasuryFee.model";
import { PharmacistDocument } from "./pharmacist.types";

export interface ITreasuryReceipt {
    serialID: string;
    pharmacist: Types.ObjectId;
    receiptBook: RECEIPT_BOOKS;
    fees: { name: string; value: number }[];
    total: number;
}

export type TreasuryReceiptDocument = HydratedDocument<ITreasuryReceipt> & {
    createdAt: Date;
    updateAt: Date;
};
export type PopulatedTreasuryReceiptDocument = Omit<TreasuryReceiptDocument, "pharmacist"> & {
    pharmacist: PharmacistDocument;
};

export interface ITreasuryReceiptModel extends Model<TreasuryReceiptDocument> {}
