import { HydratedDocument, Model, Types } from "mongoose";

export interface IPracticeType {
    name: string;
    fees: Types.ObjectId[];
}

export type PracticeTypeDocument = HydratedDocument<IPracticeType>;
export interface IPracticeTypeModel extends Model<PracticeTypeDocument> {}
