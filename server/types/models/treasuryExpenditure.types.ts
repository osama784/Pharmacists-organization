import { HydratedDocument, Model } from "mongoose";
import { TREASURY_SECTIONS } from "../../models/treasuryFee.model";

export interface ITreasuryExpenditure {
    serialID: string;
    name: string;
    value: number;
    associatedSection: TREASURY_SECTIONS;
    image?: string;
}

export type TreasuryExpenditureDocument = HydratedDocument<ITreasuryExpenditure> & {
    createdAt: Date;
    updatedAt: Date;
};

export interface ITreasuryExpenditureModel extends Model<TreasuryExpenditureDocument> {}
