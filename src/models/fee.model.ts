import mongoose, { Document, Schema, Types } from "mongoose";

interface IFee {
    name: string;
    section: Types.ObjectId;
    detail?: Map<string, number>[];
    value?: number;
    isMutable: boolean;
    isRepeatable: boolean;
}

type FeeDocument = Document & IFee;
type PopulatedFeeDocument = Omit<FeeDocument, "section"> & {
    section: any;
};

const Fee = new Schema<FeeDocument>({
    name: { type: String, required: true },
    section: { type: Schema.Types.ObjectId, ref: "Section", required: true },
    detail: {
        type: Map,
        of: Number,
    },
    value: {
        type: Number,
        default: 0,
    },
    isMutable: { type: Boolean, required: true },
    isRepeatable: { type: Boolean, required: true },
});

/** "isMutable" = true: means it changes from one year to another
 * so if the user haven't paid for 3 years, we sum the amount for each year
 * if = false: we multiply the current year amount ("value" field)  with the number of years
 *
 * "isRepeatable" = true: means we should multiply it by the number of years if "isMutable" = true, or find the sum of the fee by each year
 *
 * !Note: "isMutable" = true => "isRepeatble" = true
 */

export default mongoose.model("Fee", Fee, "fees");
