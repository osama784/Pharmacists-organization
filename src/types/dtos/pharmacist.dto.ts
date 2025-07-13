import {
    ILicense,
    IPenalty,
    IPharmacist,
    IPracticeRecord,
    ISyndicateRecord,
    IUniversityDegree,
    PharmacistDocument,
} from "../models/pharmacist.types.js";

export type CreatePharmacistDto = Omit<IPharmacist, "invoices">;
export type UpdatePharmacistDto = Partial<Omit<IPharmacist, "invoices">>;

export type PharmacistResponseDto = {
    id: string;
    firstName: string;
    lastName: string;
    fatherName: string;
    motherName: string;

    firstNameEnglish?: string;
    lastNameEnglish?: string;
    fatherNameEnglish?: string;
    motherNameEnglish?: string;

    gender: string;
    nationalNumber: number;
    birthDate: Date;
    birthPlace: string;
    phoneNumber: string;
    landlineNumber?: number;
    address?: string;
    graduationYear: number;
    lastTimePaid?: Date;
    nationality: string;
    ministerialNumber: number;
    ministerialRegistrationDate: Date;
    registrationNumber: number;
    registrationDate: Date;

    integrity?: string;
    register?: string;
    oathTakingDate?: Date;

    fullName: string;
    syndicateMembershipStatus: string;
    currentSyndicate?: string;
    practiceState?: string;

    licenses: ILicense[];
    practiceRecords: IPracticeRecord[];
    syndicateRecords: ISyndicateRecord[];
    universityDegrees: IUniversityDegree[];
    penalties: IPenalty[];
} & {
    createdAt: Date;
    updatedAt: Date;
};

export function toPharmacistResponseDto(data: PharmacistDocument): PharmacistResponseDto;
export function toPharmacistResponseDto(data: PharmacistDocument[]): PharmacistResponseDto[];

export function toPharmacistResponseDto(data: PharmacistDocument | PharmacistDocument[]): PharmacistResponseDto | PharmacistResponseDto[] {
    if (Array.isArray(data)) {
        let result: PharmacistResponseDto[] = [];
        for (const doc of data) {
            result.push(_toPharmacistResponseDto(doc));
        }
        return result;
    }
    return _toPharmacistResponseDto(data);
}

function _toPharmacistResponseDto(doc: PharmacistDocument): PharmacistResponseDto {
    return {
        id: doc._id.toString(),
        firstName: doc.firstName,
        lastName: doc.lastName,
        fatherName: doc.fatherName,
        motherName: doc.motherName,

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

        fullName: doc.fullName,
        currentSyndicate: doc.currentSyndicate,
        practiceState: doc.practiceState,
        syndicateMembershipStatus: doc.syndicateMembershipStatus,

        licenses: doc.licenses,
        practiceRecords: doc.practiceRecords,
        syndicateRecords: doc.syndicateRecords,
        universityDegrees: doc.universityDegrees,
        penalties: doc.penalties,

        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
}
