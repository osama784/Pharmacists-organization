import mongoose, { Model } from "mongoose";
import { z } from "zod";
import { zodSchemasMessages } from "../translation/zodSchemas.ar";

export const StringSchema = z
    .string({ message: zodSchemasMessages.INVALID_STRING })
    .nonempty({ message: zodSchemasMessages.EMPTY_STRING })
    .trim();

export const EmailSchema = StringSchema.email({ message: zodSchemasMessages.INVALID_EMAIL });

export const mongooseIDSchema = (model: Model<any>) =>
    StringSchema.refine(
        async (data) => {
            const isValid = mongoose.Types.ObjectId.isValid(data);
            if (!isValid) {
                return false;
            }
            const exists = await model.findById(data);
            if (!exists) {
                return false;
            }
            return true;
        },
        { message: zodSchemasMessages.INVALID_MONGOOSE_ID }
    );

export const PasswordSchema = StringSchema.min(4, { message: zodSchemasMessages.MIN(4) });

export const NumberSchema = z.number({ message: zodSchemasMessages.INVALID_NUMBER }).transform((value): string => value.toString());
export const NumberSchemaPositive = z
    .number({ message: zodSchemasMessages.INVALID_NUMBER })
    .min(0, { message: zodSchemasMessages.INVALID_POSITIVE_NUMBER })
    .transform((value): string => value.toString());

export const EnumSchema = (data: [string, ...string[]]) => z.enum(data, { message: zodSchemasMessages.INVALID_ENUM_VALUE(data) });

export const DateSchema = StringSchema.refine(
    (value) => {
        return !isNaN(Date.parse(value));
    },
    { message: zodSchemasMessages.INVALID_DATE }
).transform((value) => {
    return new Date(value);
});
