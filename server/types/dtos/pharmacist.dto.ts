import { z } from "zod";
import {
    LicenseDocument,
    PenaltyDocument,
    PharmacistDocument,
    PopulatedPharmacistDocument,
    SyndicateRecordDocument,
    UniversityDegreeDocument,
} from "../models/pharmacist.types.js";
import {
    createLicenseZodSchema,
    updateLicenseZodSchema,
    createPenaltyZodSchema,
    updatePenaltyZodSchema,
    createPharmacistZodSchema,
    updatePharmacistZodSchema,
    createSyndicateRecordZodSchema,
    updateSyndicateRecordZodSchema,
    createUniversityDegreeZodSchema,
    updateUniversityDegreeZodSchema,
} from "../../validators/pharmacist.schema.js";
import { dateUtils } from "../../utils/dateUtils.js";
import { Types } from "mongoose";

export type CreatePharmacistDto = z.infer<typeof createPharmacistZodSchema>;
export type UpdatePharmacistDto = z.infer<typeof updatePharmacistZodSchema>;

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
    deathDate?: Date | null;
    retirementDate?: Date | null;

    syndicateMembershipStatus?: string;
    currentSyndicate: string | SyndicateRecordResponseDto;
    currentLicense?: string | LicenseResponseDto | null;
    practiceState?: string | null;

    licenses: (LicenseResponseDto | string)[];
    syndicateRecords: (SyndicateRecordResponseDto | string)[];
    universityDegrees: (UniversityDegreeResponseDto | string)[];
    penalties: (PenaltyResponseDto | string)[];
};

export function toPharmacistResponseDto(data: PharmacistDocument | PopulatedPharmacistDocument): PharmacistResponseDto;
export function toPharmacistResponseDto(data: PharmacistDocument[] | PopulatedPharmacistDocument[]): PharmacistResponseDto[];

export function toPharmacistResponseDto(
    data: PharmacistDocument | PharmacistDocument[] | PopulatedPharmacistDocument | PopulatedPharmacistDocument[]
): PharmacistResponseDto | PharmacistResponseDto[] {
    if (Array.isArray(data)) {
        const result: PharmacistResponseDto[] = [];
        for (const doc of data) {
            result.push(_toPharmacistResponseDto(doc));
        }
        return result;
    }
    return _toPharmacistResponseDto(data);
}

function _toPharmacistResponseDto(doc: PharmacistDocument | PopulatedPharmacistDocument): PharmacistResponseDto {
    const licenses: (LicenseResponseDto | string)[] = [];
    const syndicateRecords: (SyndicateRecordResponseDto | string)[] = [];
    const universityDegrees: (UniversityDegreeResponseDto | string)[] = [];
    const penalties: (PenaltyResponseDto | string)[] = [];
    for (const license of doc.licenses) {
        licenses.push(toLicenseResponseDto(license));
    }
    for (const syndicateRecord of doc.syndicateRecords) {
        syndicateRecords.push(toSyndicateRecordResponseDto(syndicateRecord));
    }
    for (const universityDegree of doc.universityDegrees) {
        universityDegrees.push(toUniversityDegreeResponseDto(universityDegree));
    }
    for (const penalty of doc.penalties) {
        penalties.push(toPenaltyResponseDto(penalty));
    }

    let currentSyndicate: SyndicateRecordResponseDto | string;
    if (doc.currentSyndicate instanceof Types.ObjectId) {
        currentSyndicate = doc.currentSyndicate.toString();
    } else {
        currentSyndicate = toSyndicateRecordResponseDto(doc.currentSyndicate);
    }

    let currentLicense: LicenseResponseDto | string | null | undefined;
    if (!doc.currentLicense) {
        currentLicense = doc.currentLicense;
    } else {
        if (doc.currentLicense instanceof Types.ObjectId) {
            currentLicense = doc.currentLicense.toString();
        } else {
            currentLicense = toLicenseResponseDto(doc.currentLicense);
        }
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
        birthDate: dateUtils.toLocaleDate(doc.birthDate)!,
        birthPlace: doc.birthPlace,
        phoneNumber: doc.phoneNumber,
        landlineNumber: doc.landlineNumber,
        address: doc.address,
        graduationYear: dateUtils.toLocaleDate(doc.graduationYear)!,
        lastTimePaid: dateUtils.toLocaleDate(doc.lastTimePaid),
        nationality: doc.nationality,
        ministerialNumber: doc.ministerialNumber,
        ministerialRegistrationDate: dateUtils.toLocaleDate(doc.ministerialRegistrationDate),
        registrationNumber: doc.registrationNumber,
        registrationDate: dateUtils.toLocaleDate(doc.registrationDate)!,

        images: doc.images,
        integrity: doc.integrity,
        register: doc.register,
        oathTakingDate: doc.oathTakingDate,
        deathDate: dateUtils.toLocaleDate(doc.deathDate)!,
        retirementDate: dateUtils.toLocaleDate(doc.retirementDate)!,

        practiceState: doc.practiceState,
        syndicateMembershipStatus: doc.syndicateMembershipStatus,
        currentSyndicate: currentSyndicate,
        currentLicense: currentLicense,

        licenses: licenses,
        syndicateRecords: syndicateRecords,
        universityDegrees: universityDegrees,
        penalties: penalties,
    };
}

// dtos for Pharmacist arrays
export type LicenseCreateDto = z.infer<typeof createLicenseZodSchema>;
export type LicenseUpdateDto = z.infer<typeof updateLicenseZodSchema>;
type LicenseResponseDto = {
    id: string;
    pharmacist: string;
    syndicate: string;
    practiceStartDate: Date;
    licenseStartDate: Date;
    endDate?: Date | null;
    licenseType: string;
    practiceType: string;
    practiceSector: string;
    practicePlace: string;
    details?: string | null;
    images: string[];
};

export type PenaltyCreateDto = z.infer<typeof createPenaltyZodSchema>;
export type PenaltyUpdateDto = z.infer<typeof updatePenaltyZodSchema>;
type PenaltyResponseDto = {
    id: string;
    pharmacist: string;
    penaltyType: string;
    date: Date;
    reason?: string | null;
    details?: string | null;
};

export type SyndicateRecordCreateDto = z.infer<typeof createSyndicateRecordZodSchema>;
export type SyndicateRecordUpdateDto = z.infer<typeof updateSyndicateRecordZodSchema>;
type SyndicateRecordResponseDto = {
    id: string;
    pharmacist: string;
    syndicate: string;
    startDate: Date;
    endDate?: Date | null;
    transferReason?: string | null;
    registrationNumber: string;
};

export type UniversityDegreeCreateDto = z.infer<typeof createUniversityDegreeZodSchema>;
export type UniversityDegreeUpdateDto = z.infer<typeof updateUniversityDegreeZodSchema>;
type UniversityDegreeResponseDto = {
    id: string;
    pharmacist: string;
    degreeType: string;
    obtainingDate: Date;
    university: string;

    images: string[];
};

function toLicenseResponseDto(doc: LicenseDocument | Types.ObjectId): LicenseResponseDto | string {
    if (doc instanceof Types.ObjectId) {
        return doc.toString();
    }
    return {
        id: doc.id,
        pharmacist: doc.pharmacist.toString(),
        syndicate: doc.syndicate,
        licenseType: doc.licenseType,
        practiceType: doc.practiceType,
        licenseStartDate: dateUtils.toLocaleDate(doc.licenseStartDate)!,
        practiceStartDate: dateUtils.toLocaleDate(doc.practiceStartDate)!,
        endDate: dateUtils.toLocaleDate(doc.endDate),
        practicePlace: doc.practicePlace,
        practiceSector: doc.practiceSector,
        details: doc.details,
        images: doc.images,
    };
}
function toUniversityDegreeResponseDto(doc: UniversityDegreeDocument | Types.ObjectId): UniversityDegreeResponseDto | string {
    if (doc instanceof Types.ObjectId) {
        return doc.toString();
    }
    return {
        id: doc.id,
        degreeType: doc.degreeType,
        pharmacist: doc.pharmacist.toString(),
        university: doc.university,
        obtainingDate: dateUtils.toLocaleDate(doc.obtainingDate)!,
        images: doc.images,
    };
}
function toSyndicateRecordResponseDto(doc: SyndicateRecordDocument | Types.ObjectId): SyndicateRecordResponseDto | string {
    if (doc instanceof Types.ObjectId) {
        return doc.toString();
    }
    return {
        id: doc.id,
        pharmacist: doc.pharmacist.toString(),
        startDate: dateUtils.toLocaleDate(doc.startDate)!,
        endDate: dateUtils.toLocaleDate(doc.endDate),
        transferReason: doc.transferReason,
        syndicate: doc.syndicate,
        registrationNumber: doc.registrationNumber,
    };
}
function toPenaltyResponseDto(doc: PenaltyDocument | Types.ObjectId): PenaltyResponseDto | string {
    if (doc instanceof Types.ObjectId) {
        return doc.toString();
    }
    return {
        id: doc.id,
        pharmacist: doc.pharmacist.toString(),
        penaltyType: doc.penaltyType,
        reason: doc.reason,
        date: dateUtils.toLocaleDate(doc.date)!,
        details: doc.details,
    };
}
