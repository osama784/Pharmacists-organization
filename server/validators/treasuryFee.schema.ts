import { z } from "zod";
import { TreasuryFeeTR } from "../translation/models.ar";
import { EnumSchema, mongooseIDSchema, NumberSchema, StringSchema } from "../utils/customSchemas";
import { PARTIES, RECEIPT_BOOKS } from "../models/treasuryFee.model";
import { SectionsEnum } from "../models/section.model";

const TreasuryFeeSchema = z.object({
    name: StringSchema({ keyName: TreasuryFeeTR.name }),
    value: NumberSchema({ keyName: TreasuryFeeTR.value }).default(0),
    associatedSection: EnumSchema({ keyName: TreasuryFeeTR.associatedSection, data: Object.values(SectionsEnum) as [string, ...[string]] }),
    associatedParty: EnumSchema({ keyName: TreasuryFeeTR.associatedParty, data: PARTIES as [string, ...[string]], optional: true }),
    receiptBook: EnumSchema({ keyName: TreasuryFeeTR.receiptBook, data: RECEIPT_BOOKS as [string, ...[string]] }),
});

export const CreateTreasuryFeeSchema = TreasuryFeeSchema;
export const UpdateTreasuryFeeSchema = TreasuryFeeSchema.partial();
