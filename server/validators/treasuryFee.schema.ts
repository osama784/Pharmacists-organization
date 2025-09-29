import { z } from "zod";
import { TreasuryFeeModelTR } from "../translation/models.ar";
import { EnumSchema, NumberSchema, StringSchema } from "../utils/customSchemas";
import { SectionsEnum } from "../models/section.model";
import { PARTIES, RECEIPT_BOOKS } from "../models/treasuryFee.model";

const treasuryFeeZodSchema = z.object({
    name: StringSchema({ keyName: TreasuryFeeModelTR.name }),
    value: NumberSchema({ keyName: TreasuryFeeModelTR.value }).default(0),
    associatedSection: EnumSchema({
        keyName: TreasuryFeeModelTR.associatedSection,
        data: Object.values(SectionsEnum) as [string, ...[string]],
    }),
    associatedParty: EnumSchema({
        keyName: TreasuryFeeModelTR.associatedParty,
        data: Object.values(PARTIES) as [string, ...[string]],
        optional: true,
    }),
    receiptBook: EnumSchema({ keyName: TreasuryFeeModelTR.receiptBook, data: Object.values(RECEIPT_BOOKS) as [string, ...[string]] }),
});

export const createTreasuryFeeZodSchema = treasuryFeeZodSchema;
export const updateTreasuryFeeZodSchema = treasuryFeeZodSchema.partial();
