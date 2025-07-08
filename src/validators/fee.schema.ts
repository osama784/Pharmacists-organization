import mongoose from "mongoose";
import { z } from "zod";
import { mongooseIDSchema, NumberSchemaPositive, StringSchema } from "../utils/customSchemas";
import Fee from "../models/fee.model";
import { zodSchemasMessages } from "../translation/zodSchemas.ar";

export const updateFeesValuesSchema = z.array(
    z.object({
        id: mongooseIDSchema(Fee),
        value: NumberSchemaPositive.optional(),
        details: z
            .record(StringSchema, NumberSchemaPositive)
            .refine(
                (data) => {
                    // check if all years exist, 0 index => 1996 year
                    const START_YEAR = 1996;
                    const END_YEAR = new Date().getFullYear();
                    const years = Array(END_YEAR - START_YEAR + 1).fill(false);
                    for (const entry of Object.entries(data)) {
                        const keyParsed = parseInt(entry[0]);
                        const valueParsed = entry[1];
                        if (isNaN(keyParsed) || isNaN(valueParsed)) {
                            return false;
                        }

                        if (keyParsed < START_YEAR || keyParsed > END_YEAR) {
                            return false;
                        }
                        years[keyParsed - START_YEAR] = true;
                    }

                    return !years.includes(false);
                },
                { message: zodSchemasMessages.FEE_SCHEMA.INVALID_DETAILS_RECORD }
            )
            .transform((data) => {
                const entries = Object.entries(data).sort((a, b) => {
                    if (isNaN(parseInt(a[0])) || isNaN(parseInt(b[0]))) {
                        return 0;
                    }
                    return parseInt(a[0]) - parseInt(b[0]);
                });
                return new Map(entries);
            })
            .optional(),
    })
);

export const updateDetailedPrintsSchema = z.object({
    "سجل الأدوية العادية/صيدليات": NumberSchemaPositive,
    "سجل الأدوية النفسية/صيدليات": NumberSchemaPositive,
    "سجل الأدوية المخدرة/صيدليات": NumberSchemaPositive,
    "بطاقة الالتزام بالأسعار": NumberSchemaPositive,
    "كشف صرفيات مخدرات": NumberSchemaPositive,
    "حالات سريرية قيمة مطبوعات": NumberSchemaPositive,
    "قانون المخدرات": NumberSchemaPositive,
    "التراكيب الدوائية": NumberSchemaPositive,
    "مجموعة الأنظمة والقوانين": NumberSchemaPositive,
});
