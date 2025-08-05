import { z } from "zod";
import { genders, licenseTypes, practiceRecordsInfo, syndicateRecordsInfo, universityDegreeTypes } from "../models/pharmacist.model.js";
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
    nationalNumber: NumberSchema.optional().nullable(),
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

    images: z.preprocess((data) => {
        if (typeof data == "string") {
            if (data != "") return [data];
            return [];
        }
        return data;
    }, z.array(StringSchema)),

    integrity: StringSchema.optional().nullable(),
    register: StringSchema.optional().nullable(),
    oathTakingDate: DateSchema.optional().nullable(),
});

const LicenseSchema = z.object({
    licenseType: EnumSchema(Object.values(licenseTypes) as [string]),
    startDate: DateSchema,
    endDate: DateSchema.optional().nullable(),
    details: StringSchema.optional().nullable(),
    images: z.preprocess((data) => {
        if (typeof data == "string") {
            if (data != "") return [data];
            return [];
        }
        return data;
    }, z.array(StringSchema)),
});

export const CreateLicenseSchema = LicenseSchema.omit({
    images: true,
});
export const UpdateLicenseSchema = LicenseSchema.partial();

export const PracticeRecordSchema = z
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
    );

export const PenaltySchema = z.object({
    penaltyType: StringSchema,
    date: DateSchema,
    reason: StringSchema.optional().nullable(),
    details: StringSchema.optional().nullable(),
});
export const SyndicateRecordSchema = z
    .object({
        syndicate: EnumSchema(Object.values(syndicateRecordsInfo.syndicate) as [string]),
        startDate: DateSchema,
        endDate: DateSchema.optional().nullable(),
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
    );
const UniversityDegreeSchema = z.object({
    degreeType: EnumSchema(Object.values(universityDegreeTypes) as [string]),
    obtainingDate: DateSchema,
    university: StringSchema,
    images: z.preprocess((data) => {
        if (typeof data == "string") {
            if (data != "") return [data];
            return [];
        }

        return data;
    }, z.array(StringSchema)),
});
export const CreateUniversityDegreeSchema = UniversityDegreeSchema.omit({
    images: true,
});
export const UpdateUniversityDegreeSchema = UniversityDegreeSchema.partial();

export const CreatePharmacistSchema = PharmacistSchema.omit({
    images: true,
});
export const UpdatePharmacistSchema = PharmacistSchema.partial();
