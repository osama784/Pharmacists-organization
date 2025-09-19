import { z } from "zod";
import { EnumSchema, NumberSchema, StringSchema } from "../utils/customSchemas";
import { TreasuryExpenditureModelTR } from "../translation/models.ar";
import { TREASURY_SECTIONS } from "../models/treasuryFee.model";

const TreasuryExpenditureSchema = z.object({
    name: StringSchema({ keyName: TreasuryExpenditureModelTR.name }),
    value: NumberSchema({ keyName: TreasuryExpenditureModelTR.value }),
    associatedSection: EnumSchema({
        keyName: TreasuryExpenditureModelTR.associatedSection,
        data: Object.values(TREASURY_SECTIONS) as [string, ...string[]],
    }),
    image: StringSchema({ keyName: TreasuryExpenditureModelTR.image, optional: true }),
});

export const TreasuryExpenditureCreateSchema = TreasuryExpenditureSchema.omit({ image: true });
export const TreasuryExpenditureUpdateSchema = TreasuryExpenditureSchema.partial();
