import { HydratedDocument, Model, Types } from "mongoose";
import { SectionDocument } from "./section.types";

export enum PartiesEnum {
    Credentialing = "الذاتية",
    RegistryOffice = "الديوان",
    PrintsRepository = "مستودع المطبوعات",
}

export enum ReceiptBooksEnum {
    Prints = "مطبوعات",
    Documents = "وثائق",
    Settlement = "تسوية",
}

interface ITreasuryFee {
    name: string;
    value: number;
    associatedParty?: PartiesEnum;
    associatedSection: Types.ObjectId;
    receiptBook: ReceiptBooksEnum;
}

export type TreasuryFeeDocument = HydratedDocument<ITreasuryFee> & {
    createdAt: Date;
    updatedAt: Date;
};

export type PopulatedTreasuryFeeDocument = Omit<TreasuryFeeDocument, "associatedSection"> & {
    associatedSection: SectionDocument;
};

export interface ITreasuryFeeModel extends Model<TreasuryFeeDocument> {}
