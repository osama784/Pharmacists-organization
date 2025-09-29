import { z } from "zod";
import { NumberSchema, StringSchema } from "../utils/customSchemas";
import { TreasuryStampModelTR } from "../translation/models.ar";

const treasuryStampZodSchema = z.object({
    name: StringSchema({ keyName: TreasuryStampModelTR.name }),
    value: NumberSchema({ keyName: TreasuryStampModelTR.value }),
    initialQuantity: NumberSchema({ keyName: TreasuryStampModelTR.initialQuantity }),
});

export const createTreasuryStampZodSchema = treasuryStampZodSchema;
export const updateTreasuryStampZodSchema = treasuryStampZodSchema.partial();
