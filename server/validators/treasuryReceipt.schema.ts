import { z } from "zod";
import { EnumSchema, mongooseIDSchema, NumberSchemaPositive, StringSchema } from "../utils/customSchemas";
import { TreasuryReceiptModelTR } from "../translation/models.ar";
import TreasuryFee, { RECEIPT_BOOKS } from "../models/treasuryFee.model";
import { zodSchemasMessages } from "../translation/zodSchemas.ar";

const TreasuryReceiptSchema = z.object({
    pharmacist: mongooseIDSchema({ keyName: TreasuryReceiptModelTR.pharmacist }),
    receiptBook: EnumSchema({
        keyName: TreasuryReceiptModelTR.receiptBook,
        data: Object.values(RECEIPT_BOOKS) as [string, ...string[]],
    }),
    fees: z
        .array(
            z.object({
                name: StringSchema({ keyName: TreasuryReceiptModelTR.fees.name }),
                value: NumberSchemaPositive({ keyName: TreasuryReceiptModelTR.fees.value }),
            })
        )
        .refine(
            async (data) => {
                for (const obj of data) {
                    const fee = await TreasuryFee.findOne({ name: obj.name });
                    if (!fee) {
                        return false;
                    }
                    return true;
                }
            },
            { message: zodSchemasMessages.TREASURY_FEES_SCHEMA.INVALID_FEES }
        ),
});

export const TreasuryReceiptCreateSchema = TreasuryReceiptSchema;
export const TreasuryReceiptUpdateSchema = TreasuryReceiptSchema.omit({ receiptBook: true }).partial();
