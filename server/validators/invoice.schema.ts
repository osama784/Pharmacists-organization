import { z } from "zod";
import { syndicateMemberships } from "../models/syndicateMembership.model.js";
import Fee from "../models/fee.model.js";
import { EnumSchema, mongooseIDSchema, NumberSchemaPositive, StringSchema } from "../utils/customSchemas.js";
import { zodSchemasMessages } from "../translation/zodSchemas.ar.js";
import { InvoiceModelTR } from "../translation/models.ar.js";
import { invoiceStatuses } from "../models/invoice.model.js";

const InvoiceSchema = z.object({
    syndicateMembership: EnumSchema({ data: syndicateMemberships as [string], keyName: InvoiceModelTR.syndicateMembership }),
    status: EnumSchema({ data: Object.values(invoiceStatuses) as [string, ...string[]], keyName: InvoiceModelTR.status }),
    bank: mongooseIDSchema({ keyName: InvoiceModelTR.bank }),
    fees: z
        .array(
            z.object({
                name: StringSchema({ keyName: InvoiceModelTR.fees.name }).refine(
                    async (value) => {
                        const exists = await Fee.exists({ name: value });
                        if (exists) {
                            return true;
                        }
                        return false;
                    },
                    { message: zodSchemasMessages.INVOICE_SCHEMA.FEE_NAME_NOT_FOUND }
                ),
                value: NumberSchemaPositive({ keyName: InvoiceModelTR.fees.value }),
                numOfYears: NumberSchemaPositive({ keyName: InvoiceModelTR.fees.numOfYears }),
            })
        )
        .refine(
            async (fees) => {
                // check all fees' IDs get sent
                const allFees = (await Fee.find()).map((fee) => fee.name);
                if (fees.length != allFees.length) {
                    return false;
                }

                const filteredFees = fees.filter((fee) => !allFees.includes(fee.name));

                return filteredFees.length == 0;
            },
            { message: zodSchemasMessages.INVOICE_SCHEMA.ALL_FEES_SHOULD_EXIST }
        ),
});

export const InvoiceCreateSchema = InvoiceSchema.extend({
    calculateFees: z.boolean().optional(),
    willPracticeThisYear: z.boolean(),
}).omit({ status: true, fees: true });
export const InvoiceUpdateSchema = InvoiceSchema.omit({ bank: true }).partial();
