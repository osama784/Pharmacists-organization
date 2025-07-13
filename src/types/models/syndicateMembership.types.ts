import { HydratedDocument, Model, Types } from "mongoose";

export interface ISyndicateMemberShip {
    name: string;
    fees: Types.ObjectId[];
}

export type SyndicateMemberShipDocument = HydratedDocument<ISyndicateMemberShip>;
export interface ISyndicateMemberShipModel extends Model<SyndicateMemberShipDocument> {}
