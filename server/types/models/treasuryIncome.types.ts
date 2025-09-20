import { HydratedDocument, Model } from "mongoose";
import { TREASURY_SECTIONS } from "../../models/treasuryFee.model";

export interface ITreasuryIncome {
    serialID: string;
    name: string;
    value: number;
    associatedSection: TREASURY_SECTIONS;
    images: string[];
}

export type TreasuryIncomeDocument = HydratedDocument<ITreasuryIncome> & {
    createdAt: Date;
    updatedAt: Date;
};

export interface ITreasuryIncomeModel extends Model<TreasuryIncomeDocument> {}
