import { HydratedDocument, Model } from "mongoose";

export interface IBank {
    name: string;
    accounts: { section: string; accountNum: string }[];
}

export type BankDocument = HydratedDocument<IBank> & {
    createdAt: Date;
    updatedAt: Date;
    getAccount(section: string): { section: string; accountNum: string };
};
export interface IBankModel extends Model<BankDocument> {}
