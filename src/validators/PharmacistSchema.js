import mongoose from "mongoose";
import { z } from "zod";
import { licenseTypes, penaltyTypes, practiceRecordsInfo, universityDegreeTypes } from "../models/Pharmacist.js";

const PharmacistSchema = z.object({
    firstName: z.string().trim(),
    lastName: z.string().trim(),
    motherName: z.string().trim(),
    fatherName: z.string().trim(),
    gender: z.enum(["male", "female"]),
    nationalNumber: z.string().trim(),
    birthPlace: z.string().trim(),
    birthDate: z
        .string()
        .trim()
        .refine((value) => {
            return !isNaN(Date.parse(value));
        })
        .transform((value) => {
            return new Date(value);
        }),
    phoneNumber: z.string().trim(),
    address: z.string(),
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
    nationality: z.string().trim(),

    registrationInfo: z.object({
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
    }),

    licenses: z
        .object({
            licenseType: z.enum(Object.values(licenseTypes)),
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
        .optional(),

    practiceRecords: z
        .object({
            organization: z.enum(Object.values(practiceRecordsInfo.organization)),
            characteristic: z.enum(Object.values(practiceRecordsInfo.characteristic)),
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
        .optional(),

    universityDegrees: z
        .object({
            degreeType: z.enum(Object.values(universityDegreeTypes)),
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
        .optional(),

    penalties: z
        .object({
            penaltyType: z.enum(Object.values(penaltyTypes)),
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
        .optional(),
});

export default PharmacistSchema;
