import { HydratedDocument, Model, Types } from "mongoose";
import { SectionDocument } from "./section.types";
import { PARTIES, RECEIPT_BOOKS } from "../../models/treasuryFee.model";

export interface ITreasuryFee {
    name: string;
    value: number;
    associatedParty?: PARTIES;
    associatedSection: Types.ObjectId;
    receiptBook: RECEIPT_BOOKS;
}

export type TreasuryFeeDocument = HydratedDocument<ITreasuryFee> & {
    createdAt: Date;
    updatedAt: Date;
};

export type PopulatedTreasuryFeeDocument = Omit<TreasuryFeeDocument, "associatedSection"> & {
    associatedSection: SectionDocument;
};

export interface ITreasuryFeeModel extends Model<TreasuryFeeDocument> {}
