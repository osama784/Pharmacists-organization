import { z } from "zod";
import mongoose from "mongoose";
import PracticeType, { practiceTypes } from "../models/practiceType.model.js";
import Section from "../models/section.model.js";
import Fee from "../models/fee.model.js";
import { DateSchema, EnumSchema, mongooseIDSchema, NumberSchemaPositive, StringSchema } from "../utils/customSchemas.js";
import { zodSchemasMessages } from "../translation/zodSchemas.ar.js";

const InvoiceSchema = z.object({
    practiceType: EnumSchema(practiceTypes as [string]),

    createdAt: DateSchema,
    fees: z
        .array(
            z.object({
                feeRef: mongooseIDSchema(Fee),
                feeName: StringSchema.refine(
                    async (value) => {
                        const exists = await Fee.exists({ name: value });
                        if (exists) {
                            return true;
                        }
                        return false;
                    },
                    { message: zodSchemasMessages.INVOICE_SCHEMA.FEE_NAME_NOT_FOUND }
                ),
                sectionName: StringSchema.refine(
                    async (value) => {
                        const exists = await Section.exists({ name: value });
                        if (exists) {
                            return true;
                        }
                        return false;
                    },
                    { message: zodSchemasMessages.INVOICE_SCHEMA.SECTION_NAME_NOT_FOUND }
                ),
                value: NumberSchemaPositive,
            })
        )
        .refine(
            async (fees) => {
                // check all fees' IDs get sent
                const sections = await Section.find();
                const excludedFees = sections.map((section) => section.fineSummaryFee);
                const allFees = (await Fee.find({ _id: { $nin: excludedFees } })).map((fee) => fee.id);
                if (fees.length != allFees.length) {
                    return false;
                }

                const filteredFees = fees.filter((fee) => !allFees.includes(fee.feeRef.toString()));

                return filteredFees.length == 0;
            },
            { message: zodSchemasMessages.INVOICE_SCHEMA.ALL_FEES_SHOULD_EXIST }
        ),
});

export default InvoiceSchema;
