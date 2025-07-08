import { z } from "zod";
import { licenseTypes, penaltyTypes, practiceRecordsInfo, universityDegreeTypes } from "../models/pharmacist.model.js";
import { DateSchema, EnumSchema, NumberSchema, NumberSchemaPositive, StringSchema } from "../utils/customSchemas.js";

const PharmacistSchema = z.object({
    firstName: StringSchema,
    lastName: StringSchema,
    motherName: StringSchema,
    fatherName: StringSchema,
    gender: EnumSchema(["ذكر", "أنثى"] as unknown as [string]),
    nationalNumber: StringSchema,
    birthPlace: StringSchema,
    birthDate: DateSchema,
    phoneNumber: StringSchema,
    address: StringSchema,
    graduationYear: NumberSchemaPositive,
    lastTimePaid: DateSchema,
    nationality: StringSchema,

    ministerialNumber: NumberSchema,
    ministerialRegistrationDate: DateSchema,
    registrationNumber: NumberSchema,
    registrationDate: DateSchema,

    licenses: z
        .array(
            z.object({
                licenseType: EnumSchema(Object.values(licenseTypes) as [string]),
                startDate: DateSchema,
                endDate: DateSchema,
                details: StringSchema.optional(),
            })
        )
        .optional(),

    practiceRecords: z
        .array(
            z.object({
                organization: EnumSchema(Object.values(practiceRecordsInfo.organization) as [string]),
                characteristic: EnumSchema(Object.values(practiceRecordsInfo.characteristic) as [string]),
                startDate: DateSchema,
                endDate: DateSchema,
                sector: StringSchema,
                place: StringSchema,
            })
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
