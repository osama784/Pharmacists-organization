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

    syndicateMembershipStatus: string;
    currentSyndicate?: string;
    practiceState?: string;

    licenses?: ILicense[];
    practiceRecords?: IPracticeRecord[];
    syndicateRecords?: ISyndicateRecord[];
    universityDegrees?: IUniversityDegree[];
    penalties?: IPenalty[];
};

export function toPharmacistResponseDto(data: PharmacistDocument): PharmacistResponseDto;
export function toPharmacistResponseDto(data: PharmacistDocument[]): PharmacistResponseDto[];

export function toPharmacistResponseDto(data: PharmacistDocument | PharmacistDocument[]): PharmacistResponseDto | PharmacistResponseDto[] {
    if (Array.isArray(data)) {
        let result: PharmacistResponseDto[] = [];
        for (const doc of data) {
            result.push({
                id: doc._id.toString(),
                firstName: doc.firstName,
                lastName: doc.lastName,
                fatherName: doc.fatherName,
                motherName: doc.motherName,
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

                licenses: doc.licenses,
                practiceRecords: doc.practiceRecords,
                syndicateRecords: doc.syndicateRecords,
                universityDegrees: doc.universityDegrees,
                penalties: doc.penalties,
            });
        }
        return result;
    }
    return {
        id: data._id.toString(),
        firstName: data.firstName,
        lastName: data.lastName,
        fatherName: data.fatherName,
        motherName: data.motherName,
        gender: data.gender,
        nationalNumber: data.nationalNumber,
        birthDate: data.birthDate,
        birthPlace: data.birthPlace,
        phoneNumber: data.phoneNumber,
        landlineNumber: data.landlineNumber,
        address: data.address,
        graduationYear: data.graduationYear,
        lastTimePaid: data.lastTimePaid,
        nationality: data.nationality,
        ministerialNumber: data.ministerialNumber,
        ministerialRegistrationDate: data.ministerialRegistrationDate,
        registrationNumber: data.registrationNumber,
        registrationDate: data.registrationDate,
        integrity: data.integrity,
        register: data.register,

        practiceState: data.practiceState,
        syndicateMembershipStatus: data.syndicateMembershipStatus,

        licenses: data.licenses,
        practiceRecords: data.practiceRecords,
        syndicateRecords: data.syndicateRecords,
        universityDegrees: data.universityDegrees,
        penalties: data.penalties,
    };
}
