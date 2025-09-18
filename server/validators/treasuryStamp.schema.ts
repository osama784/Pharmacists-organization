import { z } from "zod";
import { NumberSchema, StringSchema } from "../utils/customSchemas";
import { TreasuryStampModelTR } from "../translation/models.ar";

const TreasuryStampSchema = z.object({
    name: StringSchema({ keyName: TreasuryStampModelTR.name }),
    value: NumberSchema({ keyName: TreasuryStampModelTR.value }),
    initialQuantity: NumberSchema({ keyName: TreasuryStampModelTR.initialQuantity }),
});

export const TreasuryStampCreateSchema = TreasuryStampSchema;
export const TreasuryStampUpdateSchema = TreasuryStampSchema.partial();
