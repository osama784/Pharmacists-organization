import { z } from "zod";
import { EnumSchema, NumberSchema, StringSchema } from "../utils/customSchemas";
import { TREASURY_SECTIONS } from "../models/treasuryFee.model";
import { TreasuryIncomeModelTR } from "../translation/models.ar";

const TreasuryIncomeSchema = z.object({
    name: StringSchema({ keyName: TreasuryIncomeModelTR.name }),
    value: NumberSchema({ keyName: TreasuryIncomeModelTR.value }),
    associatedSection: EnumSchema({
        keyName: TreasuryIncomeModelTR.associatedSection,
        data: Object.values(TREASURY_SECTIONS) as [string, ...string[]],
    }),
    image: StringSchema({ keyName: TreasuryIncomeModelTR.image, optional: true }),
});

export const TreasuryIncomeCreateSchema = TreasuryIncomeSchema.omit({ image: true });
export const TreasuryIncomeUpdateSchema = TreasuryIncomeSchema.partial();
