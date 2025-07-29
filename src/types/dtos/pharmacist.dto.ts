import { z } from "zod";
import {
    IDossierStatuses,
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
    nationalNumber?: number | null;
    birthDate: Date;
    birthPlace?: string | null;
    phoneNumber?: string | null;
    landlineNumber?: number | null;
    address?: string | null;
    graduationYear: number;
    lastTimePaid?: Date | null;
    nationality: string;
    ministerialNumber?: number | null;
    ministerialRegistrationDate?: Date | null;
    registrationNumber: number;
    registrationDate: Date;

    integrity?: string | null;
    register?: string | null;
    oathTakingDate?: Date | null;

    syndicateMembershipStatus?: string;
    currentSyndicate?: ISyndicateRecord | null;
    practiceState?: string | null;

    licenses: ILicense[];
    dossierStatuses: IDossierStatuses[];
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
    const dossierStatuses: IDossierStatuses[] = [];
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
    for (const dossierStatus of doc.dossierStatuses) {
        dossierStatuses.push({
            ...dossierStatus.toJSON(),
            date: toLocalDate(dossierStatus.date)!,
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
        graduationYear: doc.graduationYear,
        lastTimePaid: toLocalDate(doc.lastTimePaid),
        nationality: doc.nationality,
        ministerialNumber: doc.ministerialNumber,
        ministerialRegistrationDate: toLocalDate(doc.ministerialRegistrationDate),
        registrationNumber: doc.registrationNumber,
        registrationDate: toLocalDate(doc.registrationDate)!,
        integrity: doc.integrity,
        register: doc.register,

        practiceState: doc.practiceState,
        syndicateMembershipStatus: doc.syndicateMembershipStatus,
        currentSyndicate: currentSyndicate,

        licenses: licenses,
        dossierStatuses: dossierStatuses,
        practiceRecords: practiceRecords,
        syndicateRecords: syndicateRecords,
        universityDegrees: universityDegrees,
        penalties: penalties,
    };
}
