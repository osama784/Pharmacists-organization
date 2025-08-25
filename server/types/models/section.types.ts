import mongoose, { HydratedDocument, Model, PopulatedDoc } from "mongoose";
import { FeeDocument } from "./fee.types.js";

interface ISection {
    name: string;
    fees: mongoose.Types.ObjectId[];
    fineableFees: mongoose.Types.ObjectId[];
    fineSummaryFee: mongoose.Types.ObjectId;
}

export type SectionDocument = HydratedDocument<ISection>;

export interface ISectionModel extends Model<SectionDocument> {}
