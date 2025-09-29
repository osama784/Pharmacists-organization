import { z } from "zod";
import { EnumSchema, NumberSchema, StringSchema } from "../utils/customSchemas";
import { TreasuryExpenditureModelTR } from "../translation/models.ar";
import { TREASURY_SECTIONS } from "../models/treasuryFee.model";

const treasuryExpenditureZodSchema = z.object({
    name: StringSchema({ keyName: TreasuryExpenditureModelTR.name }),
    value: NumberSchema({ keyName: TreasuryExpenditureModelTR.value }),
    associatedSection: EnumSchema({
        keyName: TreasuryExpenditureModelTR.associatedSection,
        data: Object.values(TREASURY_SECTIONS) as [string, ...string[]],
    }),
    images: z.preprocess((data) => {
        if (typeof data == "string") {
            if (data != "") return [data];
            return [];
        }
        return data;
    }, z.array(StringSchema(TreasuryExpenditureModelTR.images))),
});

export const createTreasuryExpenditureZodSchema = treasuryExpenditureZodSchema.omit({ images: true });
export const updateTreasuryExpenditureZodSchema = treasuryExpenditureZodSchema.partial();
