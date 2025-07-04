import { HydratedDocument, Model, PopulatedDoc, Types } from "mongoose";
import { SectionDocument } from "./section.types.js";

interface IFee {
    name: string;
    section: Types.ObjectId;
    detail?: Map<string, number>;
    value?: number;
    isMutable: boolean;
    isRepeatable: boolean;
}

export type FeeDocument = HydratedDocument<IFee>;
export type PopulatedFeeDocument = Omit<FeeDocument, "section"> & {
    section: SectionDocument;
};

export interface IFeeModel extends Model<FeeDocument> {}
