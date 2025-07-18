import { z } from "zod";
import {
    ICurrentSyndicate,
    IDossierStatuses,
    ILicense,
    IPenalty,
    IPracticeRecord,
    ISyndicateRecord,
    IUniversityDegree,
    PharmacistDocument,
} from "../models/pharmacist.types.js";
import { CreatePharmacistSchema, UpdatePharmacistSchema } from "../../validators/pharmacist.schema.js";

export type CreatePharmacistDto = z.infer<typeof CreatePharmacistSchema>;
export type UpdatePharmacistDto = z.infer<typeof UpdatePharmacistSchema>;

export type PharmacistResponseDto = {
    id: string;
    firstName: string;
    lastName: string;
    fatherName: string;
    motherName: string;

    fullName: string;

    firstNameEnglish?: string;
    lastNameEnglish?: string;
    fatherNameEnglish?: string;
    motherNameEnglish?: string;

    gender: string;
    nationalNumber?: number;
    birthDate: Date;
    birthPlace?: string;
    phoneNumber?: string;
    landlineNumber?: number;
    address?: string;
    graduationYear: number;
    lastTimePaid?: Date;
    nationality: string;
    ministerialNumber?: number;
    ministerialRegistrationDate?: Date;
    registrationNumber: number;
    registrationDate: Date;

    integrity?: string;
    register?: string;
    oathTakingDate?: Date;

    syndicateMembershipStatus: string;
    currentSyndicate: ICurrentSyndicate | null;
    practiceState?: string;

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
        birthDate: doc.birthDate,
        birthPlace: doc.birthPlace,
        phoneNumber: doc.phoneNumber,
        landlineNumber: doc.landlineNumber,
        address: doc.address,
        graduationYear: doc.graduationYear,
        lastTimePaid: doc.lastTimePaid,
        nationality: doc.nationality,
        ministerialNumber: doc.ministerialNumber,
        ministerialRegistrationDate: doc.ministerialRegistrationDate,
        registrationNumber: doc.registrationNumber,
        registrationDate: doc.registrationDate,
        integrity: doc.integrity,
        register: doc.register,

        practiceState: doc.practiceState,
        syndicateMembershipStatus: doc.syndicateMembershipStatus,

        currentSyndicate: doc.currentSyndicate,

        licenses: doc.licenses,
        dossierStatuses: doc.dossierStatuses,
        practiceRecords: doc.practiceRecords,
        syndicateRecords: doc.syndicateRecords.slice(1),
        universityDegrees: doc.universityDegrees,
        penalties: doc.penalties,
    };
}
