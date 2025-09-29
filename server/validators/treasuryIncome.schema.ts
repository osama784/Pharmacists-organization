import { z } from "zod";
import { EnumSchema, NumberSchema, StringSchema } from "../utils/customSchemas";
import { TREASURY_SECTIONS } from "../models/treasuryFee.model";
import { TreasuryIncomeModelTR } from "../translation/models.ar";

const treasuryIncomeZodSchema = z.object({
    name: StringSchema({ keyName: TreasuryIncomeModelTR.name }),
    value: NumberSchema({ keyName: TreasuryIncomeModelTR.value }),
    associatedSection: EnumSchema({
        keyName: TreasuryIncomeModelTR.associatedSection,
        data: Object.values(TREASURY_SECTIONS) as [string, ...string[]],
    }),
    images: z.preprocess((data) => {
        if (typeof data == "string") {
            if (data != "") return [data];
            return [];
        }
        return data;
    }, z.array(StringSchema(TreasuryIncomeModelTR.images))),
});

export const createTreasuryIncomeZodSchema = treasuryIncomeZodSchema.omit({ images: true });
export const updateTreasuryIncomeZodSchema = treasuryIncomeZodSchema.partial();
