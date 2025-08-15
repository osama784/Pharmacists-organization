import { z } from "zod";
import { genders, licenseTypes, practiceRecordsInfo, syndicateRecordsInfo, universityDegreeTypes } from "../models/pharmacist.model.js";
import { DateSchema, EnumSchema, NumberSchema, EmptyStringSchema, NumberSchemaPositive, StringSchema } from "../utils/customSchemas.js";
import { zodSchemasMessages } from "../translation/zodSchemas.ar.js";
import { PharmacistModelTR } from "../translation/models.ar.js";

const PharmacistSchema = z.object({
    firstName: StringSchema(PharmacistModelTR.firstName),
    lastName: StringSchema(PharmacistModelTR.lastName),
    motherName: StringSchema(PharmacistModelTR.motherName),
    fatherName: StringSchema(PharmacistModelTR.fatherName),

    firstNameEnglish: EmptyStringSchema(PharmacistModelTR.firstNameEnglish).optional().nullable(),
    lastNameEnglish: EmptyStringSchema(PharmacistModelTR.lastNameEnglish).optional().nullable(),
    fatherNameEnglish: EmptyStringSchema(PharmacistModelTR.fatherNameEnglish).optional().nullable(),
    motherNameEnglish: EmptyStringSchema(PharmacistModelTR.motherNameEnglish).optional().nullable(),

    gender: EnumSchema(genders as [string, ...string[]], PharmacistModelTR.gender),
    nationalNumber: EmptyStringSchema(PharmacistModelTR.nationalNumber).optional().nullable(),
    birthPlace: StringSchema(PharmacistModelTR.birthPlace).optional().nullable(),
    birthDate: DateSchema(PharmacistModelTR.birthDate),
    phoneNumber: EmptyStringSchema(PharmacistModelTR.phoneNumber).optional().nullable(),
    landlineNumber: EmptyStringSchema(PharmacistModelTR.landlineNumber).optional().nullable(),
    address: EmptyStringSchema(PharmacistModelTR.address).optional().nullable(),
    graduationYear: NumberSchemaPositive(PharmacistModelTR.graduationYear),
    lastTimePaid: DateSchema(PharmacistModelTR.lastTimePaid).optional().nullable(),
    nationality: StringSchema(PharmacistModelTR.nationality),

    ministerialNumber: EmptyStringSchema(PharmacistModelTR.ministerialNumber).optional().nullable(),
    ministerialRegistrationDate: DateSchema(PharmacistModelTR.ministerialRegistrationDate).optional().nullable(),
    registrationNumber: StringSchema(PharmacistModelTR.registrationNumber),
    registrationDate: DateSchema(PharmacistModelTR.registrationNumber),

    images: z.preprocess((data) => {
        if (typeof data == "string") {
            if (data != "") return [data];
            return [];
        }
        return data;
    }, z.array(StringSchema(PharmacistModelTR.images))),

    integrity: EmptyStringSchema(PharmacistModelTR.integrity).optional().nullable(),
    register: EmptyStringSchema(PharmacistModelTR.register).optional().nullable(),
    oathTakingDate: DateSchema(PharmacistModelTR.oathTakingDate).optional().nullable(),
});

const LicenseSchema = z.object({
    licenseType: EnumSchema(Object.values(licenseTypes) as [string], PharmacistModelTR.licenses.licenseType),
    startDate: DateSchema(PharmacistModelTR.licenses.startDate),
    endDate: DateSchema(PharmacistModelTR.licenses.endDate).optional().nullable(),
    details: EmptyStringSchema(PharmacistModelTR.licenses.details).optional().nullable(),
    images: z.preprocess((data) => {
        if (typeof data == "string") {
            if (data != "") return [data];
            return [];
        }
        return data;
    }, z.array(StringSchema(PharmacistModelTR.licenses.images))),
});

export const CreateLicenseSchema = LicenseSchema.omit({
    images: true,
});
export const UpdateLicenseSchema = LicenseSchema.partial();

export const PracticeRecordSchema = z
    .object({
        syndicate: EnumSchema(Object.values(practiceRecordsInfo.syndicate) as [string], PharmacistModelTR.practiceRecords.syndicate),
        practiceType: EnumSchema(
            Object.values(practiceRecordsInfo.practiceType) as [string],
            PharmacistModelTR.practiceRecords.practiceType
        ),
        startDate: DateSchema(PharmacistModelTR.practiceRecords.startDate),
        endDate: DateSchema(PharmacistModelTR.practiceRecords.endDate).optional().nullable(),
        sector: StringSchema(PharmacistModelTR.practiceRecords.sector),
        place: StringSchema(PharmacistModelTR.practiceRecords.place),
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
        { message: `${PharmacistModelTR.practiceRecords.startDate} : ${zodSchemasMessages.START_lt_END_DATE}` }
    );

export const PenaltySchema = z.object({
    penaltyType: StringSchema(PharmacistModelTR.penalties.penaltyType),
    date: DateSchema(PharmacistModelTR.penalties.date),
    reason: EmptyStringSchema(PharmacistModelTR.penalties.reason).optional().nullable(),
    details: EmptyStringSchema(PharmacistModelTR.penalties.details).optional().nullable(),
});
export const SyndicateRecordSchema = z
    .object({
        syndicate: EnumSchema(Object.values(syndicateRecordsInfo.syndicate) as [string], PharmacistModelTR.syndicateRecords.syndicate),
        startDate: DateSchema(PharmacistModelTR.syndicateRecords.startDate),
        endDate: DateSchema(PharmacistModelTR.syndicateRecords.endDate).optional().nullable(),
        registrationNumber: StringSchema(PharmacistModelTR.syndicateRecords.registrationNumber),
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
        { message: `${PharmacistModelTR.syndicateRecords.startDate}: ${zodSchemasMessages.START_lt_END_DATE}` }
    );
const UniversityDegreeSchema = z.object({
    degreeType: EnumSchema(Object.values(universityDegreeTypes) as [string], PharmacistModelTR.universityDegrees.degreeType),
    obtainingDate: DateSchema(PharmacistModelTR.universityDegrees.obtainingDate),
    university: StringSchema(PharmacistModelTR.universityDegrees.university),
    images: z.preprocess((data) => {
        if (typeof data == "string") {
            if (data != "") return [data];
            return [];
        }

        return data;
    }, z.array(StringSchema(PharmacistModelTR.universityDegrees.images))),
});
export const CreateUniversityDegreeSchema = UniversityDegreeSchema.omit({
    images: true,
});
export const UpdateUniversityDegreeSchema = UniversityDegreeSchema.partial();

export const CreatePharmacistSchema = PharmacistSchema.omit({
    images: true,
});
export const UpdatePharmacistSchema = PharmacistSchema.partial();
