import mongoose, { Model } from "mongoose";
import { z } from "zod";
import { zodSchemasMessages } from "../translation/zodSchemas.ar";

export const StringSchema = (keyName: string | undefined = undefined) => {
    if (keyName) {
        return z
            .string({ message: `${keyName}: ${zodSchemasMessages.INVALID_STRING}` })
            .nonempty({ message: zodSchemasMessages.EMPTY_STRING })
            .trim();
    }
    return z.string({ message: zodSchemasMessages.INVALID_STRING }).nonempty({ message: zodSchemasMessages.EMPTY_STRING }).trim();
};

export const EmailSchema = (keyName: string | undefined = undefined) => {
    let message: string = "";
    if (keyName) {
        message = `${keyName}: ${zodSchemasMessages.INVALID_EMAIL}`;
    } else {
        message = zodSchemasMessages.INVALID_EMAIL;
    }
    return StringSchema(keyName).email({ message });
};

export const mongooseIDSchema = (model: Model<any>, keyName: string | undefined = undefined) => {
    let message: string = "";
    if (keyName) {
        message = `${keyName}: ${zodSchemasMessages.INVALID_MONGOOSE_ID}`;
    } else {
        message = zodSchemasMessages.INVALID_MONGOOSE_ID;
    }
    return StringSchema(keyName).refine(
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
        { message }
    );
};

export const PasswordSchema = (keyName: string | undefined = undefined) => {
    let message: string = "";
    if (keyName) {
        message = `${keyName}: ${zodSchemasMessages.MIN(4)}`;
    } else {
        message = zodSchemasMessages.MIN(4);
    }
    return StringSchema().min(4, { message });
};

export const NumberSchema = (keyName: string | undefined = undefined) => {
    let message: string = "";
    if (keyName) {
        message = `${keyName}: ${zodSchemasMessages.INVALID_NUMBER}`;
    } else {
        message = zodSchemasMessages.INVALID_NUMBER;
    }
    return z.number({ message }).transform((value): string => value.toString());
};
export const NumberSchemaPositive = (keyName: string | undefined = undefined) => {
    if (keyName) {
        return z
            .number({ message: `${keyName}: ${zodSchemasMessages.INVALID_NUMBER}` })
            .min(0, { message: `${keyName}: ${zodSchemasMessages.INVALID_POSITIVE_NUMBER}` })
            .transform((value): string => value.toString());
    } else {
        return z
            .number({ message: zodSchemasMessages.INVALID_NUMBER })
            .min(0, { message: zodSchemasMessages.INVALID_POSITIVE_NUMBER })
            .transform((value): string => value.toString());
    }
};

export const EnumSchema = (data: [string, ...string[]], keyName: string | undefined = undefined) => {
    let message: string = "";
    if (keyName) {
        message = `${keyName}: ${zodSchemasMessages.INVALID_ENUM_VALUE(data)}`;
    } else {
        message = zodSchemasMessages.INVALID_ENUM_VALUE(data);
    }
    return z.enum(data, { message });
};

export const DateSchema = (keyName: string | undefined = undefined) => {
    let message: string = "";
    if (keyName) {
        message = `${keyName} :${zodSchemasMessages.INVALID_DATE}`;
    } else {
        message = zodSchemasMessages.INVALID_DATE;
    }
    return StringSchema(keyName)
        .refine(
            (value) => {
                return !isNaN(Date.parse(value));
            },
            { message }
        )
        .transform((value) => {
            return new Date(value);
        });
};
