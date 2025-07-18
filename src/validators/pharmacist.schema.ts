import { z } from "zod";
import {
    genders,
    licenseTypes,
    penaltyTypes,
    practiceRecordsInfo,
    syndicateRecordsInfo,
    universityDegreeTypes,
} from "../models/pharmacist.model.js";
import { DateSchema, EnumSchema, NumberSchema, NumberSchemaPositive, StringSchema } from "../utils/customSchemas.js";
import { zodSchemasMessages } from "../translation/zodSchemas.ar.js";

const PharmacistSchema = z.object({
    firstName: StringSchema,
    lastName: StringSchema,
    motherName: StringSchema,
    fatherName: StringSchema,

    firstNameEnglish: StringSchema.optional().nullable(),
    lastNameEnglish: StringSchema.optional().nullable(),
    fatherNameEnglish: StringSchema.optional().nullable(),
    motherNameEnglish: StringSchema.optional().nullable(),

    gender: EnumSchema(genders as [string, ...string[]]),
    nationalNumber: StringSchema.optional().nullable(),
    birthPlace: StringSchema.optional().nullable(),
    birthDate: DateSchema,
    phoneNumber: StringSchema.optional().nullable(),
    landlineNumber: NumberSchema.optional().nullable(),
    address: StringSchema.optional().nullable(),
    graduationYear: NumberSchemaPositive,
    lastTimePaid: DateSchema.optional().nullable(),
    nationality: StringSchema,

    ministerialNumber: NumberSchema.optional().nullable(),
    ministerialRegistrationDate: DateSchema.optional().nullable(),
    registrationNumber: NumberSchema,
    registrationDate: DateSchema,

    integrity: StringSchema.optional().nullable(),
    register: StringSchema.optional().nullable(),
    oathTakingDate: DateSchema.optional().nullable(),

    currentSyndicate: z
        .object({
            syndicate: EnumSchema(Object.values(syndicateRecordsInfo.syndicate) as [string]),
            startDate: DateSchema,
            registrationNumber: NumberSchema,
        })
        .nullable(),

    licenses: z
        .array(
            z.object({
                licenseType: EnumSchema(Object.values(licenseTypes) as [string]),
                date: DateSchema,
                details: StringSchema.optional().nullable(),
            })
        )
        .optional(),

    dossierStatuses: z
        .array(
            z.object({
                date: DateSchema,
                details: StringSchema,
            })
        )
        .optional(),

    practiceRecords: z
        .array(
            z
                .object({
                    syndicate: EnumSchema(Object.values(practiceRecordsInfo.syndicate) as [string]),
                    practiceType: EnumSchema(Object.values(practiceRecordsInfo.practiceType) as [string]),
                    startDate: DateSchema,
                    endDate: DateSchema.optional().nullable(),
                    sector: StringSchema,
                    place: StringSchema,
                })
                .refine(
                    (data) => {
                        if (!data.endDate) {
                            return true;
                        }
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

    syndicateRecords: z
        .array(
            z
                .object({
                    syndicate: EnumSchema(Object.values(syndicateRecordsInfo.syndicate) as [string]),
                    startDate: DateSchema,
                    endDate: DateSchema,
                    registrationNumber: NumberSchema,
                })
                .refine(
                    (data) => {
                        if (!data.endDate) {
                            return true;
                        }
                        if (new Date(data.startDate) > new Date(data.endDate)) {
                            return false;
                        }
                        return true;
                    },
                    { message: zodSchemasMessages.START_lt_END_DATE }
                )
        )
        // .refine(
        //     (data) => {
        //         let exist: Record<string, boolean> = {};
        //         for (const record of data) {
        //             if (exist[record.syndicate]) {
        //                 return false;
        //             }
        //             exist[record.syndicate] = true;
        //         }
        //         return true;
        //     },
        //     { message: zodSchemasMessages.PHARMACIST_SCHEMA.DUPLICATE_SYNDICATE }
        // )
        .transform((data) => {
            return data.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
        })
        .optional(),

    penalties: z
        .array(
            z.object({
                penaltyType: EnumSchema(Object.values(penaltyTypes) as [string]),
                date: DateSchema,
                reason: StringSchema.optional().nullable(),
                details: StringSchema.optional().nullable(),
            })
        )
        .optional(),
});

export const CreatePharmacistSchema = PharmacistSchema.omit({
    currentSyndicate: true,
    penalties: true,
    licenses: true,
    syndicateRecords: true,
    universityDegrees: true,
    dossierStatuses: true,
    practiceRecords: true,
});
export const UpdatePharmacistSchema = PharmacistSchema.partial();

export default PharmacistSchema;
