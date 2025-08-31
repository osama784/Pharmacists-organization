import { z } from "zod";
import { genders, licenseTypes, practiceRecordsInfo, syndicateRecordsInfo, universityDegreeTypes } from "../models/pharmacist.model.js";
import { DateSchema, EnumSchema, NumberSchema, StringSchema } from "../utils/customSchemas.js";
import { zodSchemasMessages } from "../translation/zodSchemas.ar.js";
import { PharmacistModelTR } from "../translation/models.ar.js";

const PharmacistSchema = z.object({
    firstName: StringSchema({ keyName: PharmacistModelTR.firstName }),
    lastName: StringSchema({ keyName: PharmacistModelTR.lastName }),
    motherName: StringSchema({ keyName: PharmacistModelTR.motherName }),
    fatherName: StringSchema({ keyName: PharmacistModelTR.fatherName }),

    firstNameEnglish: StringSchema({ keyName: PharmacistModelTR.firstNameEnglish, optional: true }),
    lastNameEnglish: StringSchema({ keyName: PharmacistModelTR.lastNameEnglish, optional: true }),
    fatherNameEnglish: StringSchema({ keyName: PharmacistModelTR.fatherNameEnglish, optional: true }),
    motherNameEnglish: StringSchema({ keyName: PharmacistModelTR.motherNameEnglish, optional: true }),

    gender: EnumSchema({ data: genders as [string, ...string[]], keyName: PharmacistModelTR.gender }),
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
    oathTakingDate: DateSchema({ keyName: PharmacistModelTR.oathTakingDate, optional: true }).optional().nullable(),
});

const LicenseSchema = z.object({
    licenseType: EnumSchema({ data: Object.values(licenseTypes) as [string], keyName: PharmacistModelTR.licenses.licenseType }),
    startDate: DateSchema(PharmacistModelTR.licenses.startDate),
    endDate: DateSchema({ keyName: PharmacistModelTR.licenses.endDate, optional: true }).optional().nullable(),
    details: StringSchema({ keyName: PharmacistModelTR.licenses.details, optional: true }),
    images: z.preprocess((data) => {
        if (typeof data == "string") {
            if (data != "") return [data];
            return [];
        }
        return data;
    }, z.array(StringSchema({ keyName: PharmacistModelTR.licenses.images }))),
});

export const LicenseCreateSchema = LicenseSchema.omit({
    images: true,
});
export const LicenseUpdateSchema = LicenseSchema.partial();

const PracticeRecordSchema = z.object({
    syndicate: EnumSchema({
        data: Object.values(practiceRecordsInfo.syndicate) as [string],
        keyName: PharmacistModelTR.practiceRecords.syndicate,
    }),
    practiceType: EnumSchema({
        data: Object.values(practiceRecordsInfo.practiceType) as [string],
        keyName: PharmacistModelTR.practiceRecords.practiceType,
    }),
    startDate: DateSchema(PharmacistModelTR.practiceRecords.startDate),
    endDate: DateSchema({ keyName: PharmacistModelTR.practiceRecords.endDate, optional: true }).optional().nullable(),
    sector: StringSchema({ keyName: PharmacistModelTR.practiceRecords.sector }),
    place: StringSchema({ keyName: PharmacistModelTR.practiceRecords.place }),
});

export const PracticeRecordCreateSchema = PracticeRecordSchema.refine(
    (data) => {
        if (!data.endDate) {
            return true;
        }
        if (new Date(data.startDate!) > new Date(data.endDate)) {
            return false;
        }
        return true;
    },
    { message: `${PharmacistModelTR.practiceRecords.startDate} : ${zodSchemasMessages.START_lt_END_DATE}` }
);
export const PracticeRecordUpdateSchema = PracticeRecordSchema.partial().refine(
    (data) => {
        if (!data.startDate || !data.endDate) {
            return true;
        }
        if (new Date(data.startDate!) > new Date(data.endDate)) {
            return false;
        }
        return true;
    },
    { message: `${PharmacistModelTR.practiceRecords.startDate} : ${zodSchemasMessages.START_lt_END_DATE}` }
);

const PenaltySchema = z.object({
    penaltyType: StringSchema({ keyName: PharmacistModelTR.penalties.penaltyType }),
    date: DateSchema(PharmacistModelTR.penalties.date),
    reason: StringSchema({ keyName: PharmacistModelTR.penalties.reason, optional: true }),
    details: StringSchema({ keyName: PharmacistModelTR.penalties.details, optional: true }),
});

export const PenaltyCreateSchema = PenaltySchema;
export const PenaltyUpdateSchema = PenaltySchema.partial();

const SyndicateRecordSchema = z.object({
    syndicate: EnumSchema({
        data: Object.values(syndicateRecordsInfo.syndicate) as [string],
        keyName: PharmacistModelTR.syndicateRecords.syndicate,
    }),
    startDate: DateSchema(PharmacistModelTR.syndicateRecords.startDate),
    endDate: DateSchema({ keyName: PharmacistModelTR.syndicateRecords.endDate, optional: true }).optional().nullable(),
    registrationNumber: StringSchema({ keyName: PharmacistModelTR.syndicateRecords.registrationNumber }),
});

export const SyndicateRecordCreateSchema = SyndicateRecordSchema.refine(
    (data) => {
        if (!data.endDate) {
            return true;
        }
        if (new Date(data.startDate!) > new Date(data.endDate)) {
            return false;
        }
        return true;
    },
    { message: `${PharmacistModelTR.syndicateRecords.startDate}: ${zodSchemasMessages.START_lt_END_DATE}` }
);
export const SyndicateRecordUpdateSchema = SyndicateRecordSchema.partial().refine(
    (data) => {
        if (!data.startDate || !data.endDate) {
            return true;
        }
        if (new Date(data.startDate!) > new Date(data.endDate)) {
            return false;
        }
        return true;
    },
    { message: `${PharmacistModelTR.syndicateRecords.startDate}: ${zodSchemasMessages.START_lt_END_DATE}` }
);

const UniversityDegreeSchema = z.object({
    degreeType: EnumSchema({
        data: Object.values(universityDegreeTypes) as [string],
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
export const UniversityDegreeCreateSchema = UniversityDegreeSchema.omit({
    images: true,
});
export const UniversityDegreeUpdateSchema = UniversityDegreeSchema.partial();

export const PharmacistCreateSchema = PharmacistSchema.omit({
    images: true,
});
export const PharmacistUpdateSchema = PharmacistSchema.partial();
