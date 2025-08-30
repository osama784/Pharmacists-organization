import mongoose, { Model } from "mongoose";
import { z, ZodDate, ZodNullable, ZodOptional, ZodSchema, ZodString } from "zod";
import { zodSchemasMessages } from "../translation/zodSchemas.ar";

type StringSchemaOptions = {
    keyName: string;
    optional?: boolean;
};
export function StringSchema(options: { keyName: string; optional?: false }): ZodString;
export function StringSchema(options: { keyName: string; optional: true }): ZodNullable<ZodOptional<ZodString>>;

export function StringSchema(options: StringSchemaOptions) {
    let schema: ZodString | ZodNullable<ZodOptional<ZodString>>;
    schema = z.string({ message: `${options.keyName}: ${zodSchemasMessages.INVALID_STRING}` }).trim();
    if (options.optional) {
        schema = schema.optional().nullable();
    } else {
        schema = schema.nonempty({ message: `${options.keyName}: ${zodSchemasMessages.EMPTY_STRING}` });
    }

    return schema;
}

type EmailSchemaOptions = {
    keyName: string;
};
export const EmailSchema = (options: EmailSchemaOptions) => {
    return StringSchema({ keyName: options.keyName }).email({ message: `${options.keyName}: ${zodSchemasMessages.INVALID_EMAIL}` });
};

type mongooseIDSchemaOptions = {
    keyName: string;
};
export const mongooseIDSchema = (options: mongooseIDSchemaOptions) => {
    return StringSchema({ keyName: options.keyName }).refine(
        async (data) => {
            const isValid = mongoose.Types.ObjectId.isValid(data);
            if (!isValid) {
                return false;
            }
            return true;
        },
        { message: `${options.keyName}: ${zodSchemasMessages.INVALID_MONGOOSE_ID}` }
    );
};

type PasswordSchemaOptions = {
    keyName: string;
};
export const PasswordSchema = (options: PasswordSchemaOptions) => {
    return StringSchema({ keyName: options.keyName }).min(4, { message: `${options.keyName}: ${zodSchemasMessages.MIN(4)}` });
};

type NumberSchemaOptions = {
    keyName: string;
};

export const NumberSchema = (options: NumberSchemaOptions) => {
    return z.number({ message: `${options.keyName}: ${zodSchemasMessages.INVALID_NUMBER}` }).transform((value): string => value.toString());
};

export const NumberSchemaPositive = (options: NumberSchemaOptions) => {
    return z
        .number({ message: `${options.keyName}: ${zodSchemasMessages.INVALID_NUMBER}` })
        .min(0, { message: `${options.keyName}: ${zodSchemasMessages.INVALID_POSITIVE_NUMBER}` })
        .transform((value): string => value.toString());
};

type EnumSchemaOptions = {
    keyName: string;
    data: [string, ...string[]];
};

export const EnumSchema = (options: EnumSchemaOptions) => {
    return z.enum(options.data, { message: `${options.keyName}: ${zodSchemasMessages.INVALID_ENUM_VALUE(options.data)}` });
};

type DateSchemaOptions = {
    keyName: string;
    optional?: boolean;
};

export function DateSchema(options: { keyName: string; optional?: false }): ZodDate;
export function DateSchema(options: { keyName: string; optional: true }): ZodNullable<ZodOptional<ZodDate>>;
export function DateSchema(options: DateSchemaOptions) {
    let schema: ZodDate | ZodNullable<ZodOptional<ZodDate>>;
    schema = z.coerce.date({ message: `${options.keyName} :${zodSchemasMessages.INVALID_DATE}` });
    if (options.optional) {
        return schema.optional().nullable();
    }
    return schema;
}
