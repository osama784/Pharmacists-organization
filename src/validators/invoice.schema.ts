import { z } from "zod";
import { syndicateMemberships } from "../models/syndicateMembership.model.js";
import Fee from "../models/fee.model.js";
import { DateSchema, EmptyStringSchema, EnumSchema, NumberSchemaPositive, StringSchema } from "../utils/customSchemas.js";
import { zodSchemasMessages } from "../translation/zodSchemas.ar.js";
import toLocalDate from "../utils/toLocalDate.js";
import { InvoiceModelTR } from "../translation/models.ar.js";
import { invoiceStatuses } from "../models/invoice.model.js";

const InvoiceSchema = z.object({
    syndicateMembership: EnumSchema(syndicateMemberships as [string]),
    status: EnumSchema(Object.values(invoiceStatuses) as [string, ...string[]], InvoiceModelTR.status)
        .optional()
        .nullable(),
    createdAt: DateSchema(InvoiceModelTR.createdAt).default(toLocalDate(new Date())!.toISOString()),
    fees: z
        .array(
            z.object({
                name: StringSchema(InvoiceModelTR.fees.name).refine(
                    async (value) => {
                        const exists = await Fee.exists({ name: value });
                        if (exists) {
                            return true;
                        }
                        return false;
                    },
                    { message: zodSchemasMessages.INVOICE_SCHEMA.FEE_NAME_NOT_FOUND }
                ),
                value: NumberSchemaPositive(InvoiceModelTR.fees.value),
                numOfYears: NumberSchemaPositive(InvoiceModelTR.fees.numOfYears),
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

export const CreateInvoiceSchema = InvoiceSchema.extend({
    calculateFees: z.boolean().optional(),
}).omit({ status: true, fees: true });
export const UpdateInvoiceSchema = InvoiceSchema.partial();
