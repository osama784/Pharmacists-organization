import { z } from "zod";
import {
    licenseTypes,
    penaltyTypes,
    practiceRecordsInfo,
    syndicatesRecordsInfo,
    universityDegreeTypes,
} from "../models/pharmacist.model.js";
import { DateSchema, EnumSchema, NumberSchema, NumberSchemaPositive, StringSchema } from "../utils/customSchemas.js";
import { zodSchemasMessages } from "../translation/zodSchemas.ar.js";

const PharmacistSchema = z.object({
    firstName: StringSchema,
    lastName: StringSchema,
    motherName: StringSchema,
    fatherName: StringSchema,

    firstNameEnglish: StringSchema.optional(),
    lastNameEnglish: StringSchema.optional(),
    fatherNameEnglish: StringSchema.optional(),
    motherNameEnglish: StringSchema.optional(),

    gender: EnumSchema(["ذكر", "أنثى"] as unknown as [string]),
    nationalNumber: StringSchema,
    birthPlace: StringSchema,
    birthDate: DateSchema,
    phoneNumber: StringSchema,
    landlineNumber: NumberSchema.optional(),
    address: StringSchema.optional(),
    graduationYear: NumberSchemaPositive,
    lastTimePaid: DateSchema.optional(),
    nationality: StringSchema,

    ministerialNumber: NumberSchema,
    ministerialRegistrationDate: DateSchema,
    registrationNumber: NumberSchema,
    registrationDate: DateSchema,

    integrity: StringSchema.optional(),
    register: StringSchema.optional(),
    oathTakingDate: DateSchema.optional(),

    licenses: z
        .array(
            z
                .object({
                    licenseType: EnumSchema(Object.values(licenseTypes) as [string]),
                    startDate: DateSchema,
                    endDate: DateSchema,
                    details: StringSchema.optional(),
                })
                .refine(
                    (data) => {
                        if (new Date(data.startDate) > new Date(data.endDate)) {
                            return false;
                        }
                        return true;
                    },
                    { message: zodSchemasMessages.START_lt_END_DATE }
                )
        )
        .optional(),

    practiceRecords: z
        .array(
            z
                .object({
                    syndicate: EnumSchema(Object.values(practiceRecordsInfo.syndicate) as [string]),
                    practiceType: EnumSchema(Object.values(practiceRecordsInfo.practiceType) as [string]),
                    startDate: DateSchema,
                    endDate: DateSchema,
                    sector: StringSchema,
                    place: StringSchema,
                })
                .refine(
                    (data) => {
                        if (new Date(data.startDate) > new Date(data.endDate)) {
                            return false;
                        }
                        return true;
                    },
                    { message: zodSchemasMessages.START_lt_END_DATE }
                )
        )
        .optional(),
    syndicateRecords: z
        .array(
            z
                .object({
                    syndicate: EnumSchema(Object.values(syndicatesRecordsInfo.syndicate) as [string]),
                    startDate: DateSchema,
                    endDate: DateSchema,
                })
                .refine(
                    (data) => {
                        if (new Date(data.startDate) > new Date(data.endDate)) {
                            return false;
                        }
                        return true;
                    },
                    { message: zodSchemasMessages.START_lt_END_DATE }
                )
        )
        .optional(),

    universityDegrees: z
        .array(
            z.object({
                degreeType: EnumSchema(Object.values(universityDegreeTypes) as [string]),
                obtainingDate: DateSchema,
                university: StringSchema,
            })
        )
        .optional(),

    penalties: z
        .array(
            z.object({
                penaltyType: EnumSchema(Object.values(penaltyTypes) as [string]),
                date: DateSchema,
                reason: StringSchema,
                details: StringSchema,
            })
        )
        .optional(),
});

export default PharmacistSchema;
