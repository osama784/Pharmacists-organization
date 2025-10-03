import { z } from "zod";
import { DateSchema, EnumSchema, mongooseIDSchema, NumberSchema, StringSchema } from "../utils/customSchemas.js";
import { zodSchemasMessages } from "../translation/zodSchemas.ar.js";
import { PharmacistModelTR } from "../translation/models.ar.js";
import { Gender, licensesInfo, LicenseType, Syndicate, TransferReason, UniversityDegree } from "../enums/pharmacist.enums.js";

const pharmacistZodSchema = z.object({
    firstName: StringSchema({ keyName: PharmacistModelTR.firstName }),
    lastName: StringSchema({ keyName: PharmacistModelTR.lastName }),
    motherName: StringSchema({ keyName: PharmacistModelTR.motherName }),
    fatherName: StringSchema({ keyName: PharmacistModelTR.fatherName }),

    firstNameEnglish: StringSchema({ keyName: PharmacistModelTR.firstNameEnglish, optional: true }),
    lastNameEnglish: StringSchema({ keyName: PharmacistModelTR.lastNameEnglish, optional: true }),
    fatherNameEnglish: StringSchema({ keyName: PharmacistModelTR.fatherNameEnglish, optional: true }),
    motherNameEnglish: StringSchema({ keyName: PharmacistModelTR.motherNameEnglish, optional: true }),

    gender: EnumSchema({ data: Object.values(Gender) as [string, ...string[]], keyName: PharmacistModelTR.gender }),
    nationalNumber: StringSchema({ keyName: PharmacistModelTR.nationalNumber }),
    birthPlace: StringSchema({ keyName: PharmacistModelTR.birthPlace, optional: true }),
    birthDate: DateSchema({ keyName: PharmacistModelTR.birthDate }),
    phoneNumber: StringSchema({ keyName: PharmacistModelTR.phoneNumber }),
    landlineNumber: StringSchema({ keyName: PharmacistModelTR.landlineNumber, optional: true }),
    address: StringSchema({ keyName: PharmacistModelTR.address, optional: true }),
    graduationYear: DateSchema({ keyName: PharmacistModelTR.graduationYear }),
    lastTimePaid: DateSchema({ keyName: PharmacistModelTR.lastTimePaid, optional: true }),
    nationality: StringSchema({ keyName: PharmacistModelTR.nationality }),

    ministerialNumber: StringSchema({ keyName: PharmacistModelTR.ministerialNumber, optional: true }),
    ministerialRegistrationDate: DateSchema({ keyName: PharmacistModelTR.ministerialRegistrationDate, optional: true }),
    registrationNumber: StringSchema({ keyName: PharmacistModelTR.registrationNumber }),
    registrationDate: DateSchema({ keyName: PharmacistModelTR.registrationDate }),

    images: z.preprocess((data) => {
        if (typeof data == "string") {
            if (data != "") return [data];
            return [];
        }
        return data;
    }, z.array(StringSchema(PharmacistModelTR.images))),

    integrity: StringSchema({ keyName: PharmacistModelTR.integrity, optional: true }),
    register: StringSchema({ keyName: PharmacistModelTR.register, optional: true }),
    oathTakingDate: DateSchema({ keyName: PharmacistModelTR.oathTakingDate, optional: true }),
    deathDate: DateSchema({ keyName: PharmacistModelTR.deathDate, optional: true }),
    retirementDate: DateSchema({ keyName: PharmacistModelTR.retirementDate, optional: true }),
});

const licenseZodSchema = z.object({
    relatedLease: mongooseIDSchema({ keyName: PharmacistModelTR.licenses.relatedLease }),
    licenseType: EnumSchema({ data: Object.values(LicenseType) as [string], keyName: PharmacistModelTR.licenses.licenseType }),
    licenseStartDate: DateSchema({ keyName: PharmacistModelTR.licenses.licenseStartDate }),
    practiceStartDate: DateSchema({ keyName: PharmacistModelTR.licenses.practiceStartDate }),
    practiceType: EnumSchema({
        data: Object.values(licensesInfo.practiceType) as [string],
        keyName: PharmacistModelTR.licenses.practiceType,
    }),
    practicePlace: StringSchema({ keyName: PharmacistModelTR.licenses.practicePlace }),
    practiceSector: StringSchema({ keyName: PharmacistModelTR.licenses.practiceSector }),

    endDate: DateSchema({ keyName: PharmacistModelTR.licenses.endDate, optional: true }),
    details: StringSchema({ keyName: PharmacistModelTR.licenses.details, optional: true }),
    images: z.preprocess((data) => {
        if (typeof data == "string") {
            if (data != "") return [data];
            return [];
        }
        return data;
    }, z.array(StringSchema({ keyName: PharmacistModelTR.licenses.images }))),
});

export const createLicenseZodSchema = licenseZodSchema.omit({
    images: true,
});
export const updateLicenseZodSchema = licenseZodSchema.omit({ relatedLease: true }).partial();

const penaltyZodSchema = z.object({
    penaltyType: StringSchema({ keyName: PharmacistModelTR.penalties.penaltyType }),
    date: DateSchema(PharmacistModelTR.penalties.date),
    reason: StringSchema({ keyName: PharmacistModelTR.penalties.reason, optional: true }),
    details: StringSchema({ keyName: PharmacistModelTR.penalties.details, optional: true }),
});

export const createPenaltyZodSchema = penaltyZodSchema;
export const updatePenaltyZodSchema = penaltyZodSchema.partial();

const syndicateRecordZodSchema = z.object({
    syndicate: EnumSchema({
        data: Object.values(Syndicate) as [string],
        keyName: PharmacistModelTR.syndicateRecords.syndicate,
    }),
    startDate: DateSchema(PharmacistModelTR.syndicateRecords.startDate),
    transferReason: EnumSchema({
        keyName: PharmacistModelTR.syndicateRecords.transferReason,
        data: Object.values(TransferReason) as [string, ...string[]],
    }),
    registrationNumber: StringSchema({ keyName: PharmacistModelTR.syndicateRecords.registrationNumber }),
});

export const createSyndicateRecordZodSchema = syndicateRecordZodSchema;
export const updateSyndicateRecordZodSchema = syndicateRecordZodSchema.partial();
// .refine(
//     (data) => {
//         if (!data.startDate || !data.endDate) {
//             return true;
//         }
//         if (new Date(data.startDate!) > new Date(data.endDate)) {
//             return false;
//         }
//         return true;
//     },
//     { message: `${PharmacistModelTR.syndicateRecords.startDate}: ${zodSchemasMessages.START_lt_END_DATE}` }
// );

const universityDegreeZodSchema = z.object({
    degreeType: EnumSchema({
        data: Object.values(UniversityDegree) as [string],
        keyName: PharmacistModelTR.universityDegrees.degreeType,
    }),
    obtainingDate: DateSchema(PharmacistModelTR.universityDegrees.obtainingDate),
    university: StringSchema({ keyName: PharmacistModelTR.universityDegrees.university }),
    images: z.preprocess((data) => {
        if (typeof data == "string") {
            if (data != "") return [data];
            return [];
        }

        return data;
    }, z.array(StringSchema(PharmacistModelTR.universityDegrees.images))),
});
export const createUniversityDegreeZodSchema = universityDegreeZodSchema.omit({
    images: true,
});
export const updateUniversityDegreeZodSchema = universityDegreeZodSchema.partial();

export const createPharmacistZodSchema = pharmacistZodSchema.omit({
    images: true,
});
export const updatePharmacistZodSchema = pharmacistZodSchema.partial();
