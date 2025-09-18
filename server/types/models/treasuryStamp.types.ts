import { HydratedDocument, Model } from "mongoose";

export interface ITreasuryStamp {
    serialID: string;
    name: string;
    value: number;
    initialQuantity: number;
    soldQuantity: number;
}

export type TreasuryStampDocument = HydratedDocument<ITreasuryStamp> & {
    createdAt: Date;
    updatedAt: Date;
};

export interface ITreasuryStampModel extends Model<TreasuryStampDocument> {}
