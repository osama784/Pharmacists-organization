import { z } from "zod";
import { mongooseIDSchema, NumberSchemaPositive, StringSchema } from "../utils/customSchemas";
import { zodSchemasMessages } from "../translation/zodSchemas.ar";
import { FeeModelTR } from "../translation/models.ar";

export const updateFeesValuesZodSchema = z.array(
    z.object({
        id: mongooseIDSchema({ keyName: FeeModelTR.id }),
        value: NumberSchemaPositive({ keyName: FeeModelTR.value }).optional(),
        details: z
            .record(StringSchema({ keyName: FeeModelTR.details }), NumberSchemaPositive({ keyName: FeeModelTR.details }))
            .refine(
                (data) => {
                    // check if all years exist, 0 index => 1996 year
                    const START_YEAR = 1996;
                    const END_YEAR = new Date().getFullYear();
                    const years = Array(END_YEAR - START_YEAR + 1).fill(false);
                    for (const entry of Object.entries(data)) {
                        const keyParsed = parseInt(entry[0]);
                        const valueParsed = entry[1];
                        if (isNaN(keyParsed) || isNaN(Number(valueParsed))) {
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

export const updateDetailedPrintsZodSchema = z.object({
    "سجل الأدوية العادية/صيدليات": NumberSchemaPositive({ keyName: FeeModelTR.value }),
    "سجل الأدوية النفسية/صيدليات": NumberSchemaPositive({ keyName: FeeModelTR.value }),
    "سجل الأدوية المخدرة/صيدليات": NumberSchemaPositive({ keyName: FeeModelTR.value }),
    "بطاقة الالتزام بالأسعار": NumberSchemaPositive({ keyName: FeeModelTR.value }),
    "كشف صرفيات مخدرات": NumberSchemaPositive({ keyName: FeeModelTR.value }),
    "حالات سريرية قيمة مطبوعات": NumberSchemaPositive({ keyName: FeeModelTR.value }),
    "قانون المخدرات": NumberSchemaPositive({ keyName: FeeModelTR.value }),
    "التراكيب الدوائية": NumberSchemaPositive({ keyName: FeeModelTR.value }),
    "مجموعة الأنظمة والقوانين": NumberSchemaPositive({ keyName: FeeModelTR.value }),
});
