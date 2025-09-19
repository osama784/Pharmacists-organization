import mongoose, { Model } from "mongoose";
import { z, ZodDate, ZodEffects, ZodNullable, ZodOptional, ZodSchema, ZodString } from "zod";
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
    return z.preprocess((value) => {
        if (typeof value == "string") {
            return parseInt(value);
        }
        return value;
    }, z.number({ message: `${options.keyName}: ${zodSchemasMessages.INVALID_NUMBER}` }));
};

export const NumberSchemaPositive = (options: NumberSchemaOptions) => {
    return z.preprocess((value) => {
        if (typeof value == "string") {
            return parseInt(value);
        }
        return value;
    }, z.number({ message: `${options.keyName}: ${zodSchemasMessages.INVALID_NUMBER}` }).min(0, { message: `${options.keyName}: ${zodSchemasMessages.INVALID_POSITIVE_NUMBER}` }));
};

type EnumSchemaOptions = {
    keyName: string;
    data: [string, ...string[]];
    optional?: boolean;
};

export function EnumSchema(options: { keyName: string; data: [string, ...string[]]; optional?: false }): z.ZodEnum<[string, ...string[]]>;
export function EnumSchema(options: {
    keyName: string;
    data: [string, ...string[]];
    optional: true;
}): z.ZodOptional<z.ZodEnum<[string, ...string[]]>>;
export function EnumSchema(options: EnumSchemaOptions) {
    if (options.optional) {
        return z.enum(options.data, { message: `${options.keyName}: ${zodSchemasMessages.INVALID_ENUM_VALUE(options.data)}` }).optional();
    }
    return z.enum(options.data, { message: `${options.keyName}: ${zodSchemasMessages.INVALID_ENUM_VALUE(options.data)}` });
}

type DateSchemaOptions = {
    keyName: string;
    optional?: boolean;
};

// export function DateSchema(options: { keyName: string; optional?: false });
// export function DateSchema(options: { keyName: string; optional: true }): ZodEffects<ZodDate>;
export function DateSchema(options: DateSchemaOptions) {
    // let dateSchema: ZodDate | ZodNullable<ZodOptional<ZodDate>> = z.date({
    //     errorMap: (issue, { defaultError }) => {
    //         return { message: `${options.keyName} :${zodSchemasMessages.INVALID_DATE}` };
    //     },
    // });
    // if (options.optional) {
    //     dateSchema = dateSchema.optional().nullable();
    // }
    // let schema = z.preprocess((value) => {
    //     if (value == "" || value == undefined) {
    //         return undefined;
    //     }
    //     if (value == null) {
    //         return value;
    //     }
    //     return new Date(value as string);
    // }, dateSchema);
    // return schema;
    if (options.optional) {
        return StringSchema({ keyName: options.keyName, optional: options.optional }).refine(
            (value) => {
                if (value == "" || !value) {
                    return true;
                }
                if (isNaN(Date.parse(value))) return false;

                return true;
            },
            { message: `${options.keyName} :${zodSchemasMessages.INVALID_DATE}` }
        );
    } else {
        return StringSchema({ keyName: options.keyName }).refine(
            (value) => {
                if (isNaN(Date.parse(value))) return false;

                return true;
            },
            { message: `${options.keyName} :${zodSchemasMessages.INVALID_DATE}` }
        );
    }
}

type BooleanSchemaOptions = {
    keyName: string;
    optional?: boolean;
};
export function BooleanSchema(options: BooleanSchemaOptions) {
    if (options.optional) {
        return z.preprocess((value) => {
            if (value == "true") return true;
            if (value == "false") return false;
            return value;
        }, z.boolean({ message: `${options.keyName} :${zodSchemasMessages.INVALID_BOOLEAN}` }).optional());
    }
    return z.preprocess((value) => {
        if (value == "true") return true;
        if (value == "false") return false;
        return value;
    }, z.boolean({ message: `${options.keyName} :${zodSchemasMessages.INVALID_BOOLEAN}` }));
}
