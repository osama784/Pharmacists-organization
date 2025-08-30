import { z } from "zod";
import {
    ILicense,
    IPenalty,
    IPracticeRecord,
    ISyndicateRecord,
    IUniversityDegree,
    PharmacistDocument,
} from "../models/pharmacist.types.js";
import { CreatePharmacistSchema, UpdatePharmacistSchema } from "../../validators/pharmacist.schema.js";
import toLocalDate from "../../utils/toLocalDate.js";

export type CreatePharmacistDto = z.infer<typeof CreatePharmacistSchema>;
export type UpdatePharmacistDto = z.infer<typeof UpdatePharmacistSchema>;

export type PharmacistResponseDto = {
    id: string;
    firstName: string;
    lastName: string;
    fatherName: string;
    motherName: string;

    fullName: string;

    firstNameEnglish?: string | null;
    lastNameEnglish?: string | null;
    fatherNameEnglish?: string | null;
    motherNameEnglish?: string | null;

    gender: string;
    nationalNumber: string;
    birthDate: Date;
    birthPlace?: string | null;
    phoneNumber: string;
    landlineNumber?: string | null;
    address?: string | null;
    graduationYear: Date;
    lastTimePaid?: Date | null;
    nationality: string;
    ministerialNumber?: string | null;
    ministerialRegistrationDate?: Date | null;
    registrationNumber: string;
    registrationDate: Date;

    images: string[];

    integrity?: string | null;
    register?: string | null;
    oathTakingDate?: Date | null;

    syndicateMembershipStatus?: string;
    currentSyndicate?: ISyndicateRecord | null;
    practiceState?: string | null;

    licenses: ILicense[];
    practiceRecords: IPracticeRecord[];
    syndicateRecords: ISyndicateRecord[];
    universityDegrees: IUniversityDegree[];
    penalties: IPenalty[];
};

export function toPharmacistResponseDto(data: PharmacistDocument): PharmacistResponseDto;
export function toPharmacistResponseDto(data: PharmacistDocument[]): PharmacistResponseDto[];

export function toPharmacistResponseDto(data: PharmacistDocument | PharmacistDocument[]): PharmacistResponseDto | PharmacistResponseDto[] {
    if (Array.isArray(data)) {
        const result: PharmacistResponseDto[] = [];
        for (const doc of data) {
            result.push(_toPharmacistResponseDto(doc));
        }
        return result;
    }
    return _toPharmacistResponseDto(data);
}

function _toPharmacistResponseDto(doc: PharmacistDocument): PharmacistResponseDto {
    const licenses: ILicense[] = [];
    const practiceRecords: IPracticeRecord[] = [];
    const syndicateRecords: ISyndicateRecord[] = [];
    const universityDegrees: IUniversityDegree[] = [];
    const penalties: IPenalty[] = [];
    for (const license of doc.licenses) {
        licenses.push({
            ...license.toJSON(),
            startDate: toLocalDate(license.startDate)!,
            endDate: toLocalDate(license.endDate),
        });
    }
    for (const practiceRecord of doc.practiceRecords) {
        practiceRecords.push({
            ...practiceRecord.toJSON(),
            startDate: toLocalDate(practiceRecord.startDate)!,
            endDate: toLocalDate(practiceRecord.endDate),
        });
    }
    for (const syndicateRecord of doc.syndicateRecords) {
        syndicateRecords.push({
            ...syndicateRecord.toJSON(),
            startDate: toLocalDate(syndicateRecord.startDate)!,
            endDate: toLocalDate(syndicateRecord.endDate),
        });
    }
    for (const universityDegree of doc.universityDegrees) {
        universityDegrees.push({
            ...universityDegree.toJSON(),
            obtainingDate: toLocalDate(universityDegree.obtainingDate)!,
        });
    }
    for (const penalty of doc.penalties) {
        penalties.push({
            ...penalty.toJSON(),
            date: toLocalDate(penalty.date)!,
        });
    }

    let currentSyndicate: ISyndicateRecord | null | undefined;
    if (!doc.currentSyndicate) {
        currentSyndicate = doc.currentSyndicate;
    } else {
        currentSyndicate = {
            ...doc.currentSyndicate,
            startDate: toLocalDate(doc.currentSyndicate.startDate)!,
            endDate: toLocalDate(doc.currentSyndicate.endDate),
        };
    }
    return {
        id: doc.id,
        firstName: doc.firstName,
        lastName: doc.lastName,
        fatherName: doc.fatherName,
        motherName: doc.motherName,

        fullName: doc.fullName,

        firstNameEnglish: doc.firstNameEnglish,
        lastNameEnglish: doc.lastNameEnglish,
        fatherNameEnglish: doc.fatherNameEnglish,
        motherNameEnglish: doc.motherNameEnglish,

        gender: doc.gender,
        nationalNumber: doc.nationalNumber,
        birthDate: toLocalDate(doc.birthDate)!,
        birthPlace: doc.birthPlace,
        phoneNumber: doc.phoneNumber,
        landlineNumber: doc.landlineNumber,
        address: doc.address,
        graduationYear: toLocalDate(doc.graduationYear)!,
        lastTimePaid: toLocalDate(doc.lastTimePaid),
        nationality: doc.nationality,
        ministerialNumber: doc.ministerialNumber,
        ministerialRegistrationDate: toLocalDate(doc.ministerialRegistrationDate),
        registrationNumber: doc.registrationNumber,
        registrationDate: toLocalDate(doc.registrationDate)!,

        images: doc.images,
        integrity: doc.integrity,
        register: doc.register,
        oathTakingDate: doc.oathTakingDate,

        practiceState: doc.practiceState,
        syndicateMembershipStatus: doc.syndicateMembershipStatus,
        currentSyndicate: currentSyndicate,

        licenses: licenses,
        practiceRecords: practiceRecords,
        syndicateRecords: syndicateRecords,
        universityDegrees: universityDegrees,
        penalties: penalties,
    };
}

// dtos for Pharmacist arrays
export type CreateLicenseDto = {
    licenseType: string;
    startDate: Date;
    endDate?: Date | null;
    details?: string | null;
};
export type UpdateLicenseDto = CreateLicenseDto & {
    images?: string[];
};

export type CreatePenaltyDto = {
    penaltyType: string;
    date: Date;
    reason?: string | null;
    details?: string | null;
};
export type UpdatePenaltyDto = CreatePenaltyDto;

export type CreatePracticeRecordDto = {
    syndicate: string;
    startDate: Date;
    endDate?: Date | null;
    sector: string;
    place: string;
    practiceType: string;
};
export type UpdatePracticeRecordDto = CreatePracticeRecordDto;

export type CreateSyndicateRecordDto = {
    syndicate: string;
    startDate: Date;
    endDate?: Date | null;
    registrationNumber: string;
};
export type UpdateSyndicateRecordDto = CreateSyndicateRecordDto;

export type CreateUniversityDegreeDto = {
    degreeType: string;
    obtainingDate: Date;
    university: string;
};
export type UpdateUniversityDegreeDto = CreateUniversityDegreeDto & {
    images?: string[];
};
