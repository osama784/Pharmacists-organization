import { z } from "zod";
import { licenseTypes, penaltyTypes, practiceRecordsInfo, universityDegreeTypes } from "../models/pharmacist.model.js";

const PharmacistSchema = z.object({
    firstName: z.string().nonempty().trim(),
    lastName: z.string().nonempty().trim(),
    motherName: z.string().nonempty().trim(),
    fatherName: z.string().nonempty().trim(),
    gender: z.enum(["male", "female"]),
    nationalNumber: z.string().nonempty().trim(),
    birthPlace: z.string().nonempty().trim(),
    birthDate: z
        .string()
        .trim()
        .refine((value) => {
            return !isNaN(Date.parse(value));
        })
        .transform((value) => {
            return new Date(value);
        }),
    phoneNumber: z.string().nonempty().trim(),
    address: z.string().nonempty().trim(),
    graduationYear: z.number(),
    lastTimePaid: z
        .string()
        .trim()
        .refine((value) => {
            return !isNaN(Date.parse(value));
        })
        .transform((value) => {
            return new Date(value);
        }),
    nationality: z.string().nonempty().trim(),

    ministerialNumber: z.number(),
    ministerialRegistrationDate: z
        .string()
        .trim()
        .refine((value) => {
            return !isNaN(Date.parse(value));
        })
        .transform((value) => {
            return new Date(value);
        }),
    registrationNumber: z.number(),
    registrationDate: z
        .string()
        .trim()
        .refine((value) => {
            return !isNaN(Date.parse(value));
        })
        .transform((value) => {
            return new Date(value);
        }),

    licenses: z
        .array(
            z.object({
                licenseType: z.enum(Object.values(licenseTypes) as [string]),
                startDate: z
                    .string()
                    .trim()
                    .refine((value) => {
                        return !isNaN(Date.parse(value));
                    })
                    .transform((value) => {
                        return new Date(value);
                    }),
                endDate: z
                    .string()
                    .trim()
                    .refine((value) => {
                        return !isNaN(Date.parse(value));
                    })
                    .transform((value) => {
                        return new Date(value);
                    }),
                details: z.string().trim(),
            })
        )
        .optional(),

    practiceRecords: z
        .array(
            z.object({
                organization: z.enum(Object.values(practiceRecordsInfo.organization) as [string]),
                characteristic: z.enum(Object.values(practiceRecordsInfo.characteristic) as [string]),
                startDate: z
                    .string()
                    .trim()
                    .refine((value) => {
                        return !isNaN(Date.parse(value));
                    })
                    .transform((value) => {
                        return new Date(value);
                    }),
                endDate: z
                    .string()
                    .trim()
                    .refine((value) => {
                        return !isNaN(Date.parse(value));
                    })
                    .transform((value) => {
                        return new Date(value);
                    }),
                sector: z.string().trim(),
                place: z.string().trim(),
            })
        )
        .optional(),

    universityDegrees: z
        .array(
            z.object({
                degreeType: z.enum(Object.values(universityDegreeTypes) as [string]),
                obtainingDate: z
                    .string()
                    .trim()
                    .refine((value) => {
                        return !isNaN(Date.parse(value));
                    })
                    .transform((value) => {
                        return new Date(value);
                    }),
                university: z.string().trim(),
            })
        )
        .optional(),

    penalties: z
        .array(
            z.object({
                penaltyType: z.enum(Object.values(penaltyTypes) as [string]),
                date: z
                    .string()
                    .trim()
                    .refine((value) => {
                        return !isNaN(Date.parse(value));
                    })
                    .transform((value) => {
                        return new Date(value);
                    }),
                reason: z.string().trim(),
                details: z.string().trim(),
            })
        )
        .optional(),
});

export default PharmacistSchema;
