import { HydratedDocument, Types } from "mongoose";

export interface ILicense {
    licenseType: string;
    startDate: Date;
    endDate?: Date | null;
    details?: string | null;
    images: string[];
}

export interface IPracticeRecord {
    syndicate: string;
    startDate: Date;
    endDate?: Date | null;
    sector: string;
    place: string;
    practiceType: string;
}
export interface ISyndicateRecord {
    syndicate: string;
    startDate: Date;
    endDate?: Date | null;
    registrationNumber: string;
}

export interface IUniversityDegree {
    degreeType: string;
    obtainingDate: Date;
    university: string;

    images: string[];
}

export interface IPenalty {
    penaltyType: string;
    date: Date;
    reason?: string | null;
    details?: string | null;
}

export interface IPharmacist {
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
    nationalNumber?: string | null;
    birthDate: Date;
    birthPlace?: string | null;
    phoneNumber?: string | null;
    landlineNumber?: string | null;
    address?: string | null;
    graduationYear: string;
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
    practiceState?: string | null;
    currentSyndicate?: ISyndicateRecord | null;

    licenses: Types.DocumentArray<ILicense>;
    practiceRecords: Types.DocumentArray<IPracticeRecord>;
    syndicateRecords: Types.DocumentArray<ISyndicateRecord>;
    universityDegrees: Types.DocumentArray<IUniversityDegree>;
    penalties: Types.DocumentArray<IPenalty>;

    invoices: Types.ObjectId[];
}

export type PharmacistDocument = HydratedDocument<IPharmacist> & {
    createdAt: Date;
    updatedAt: Date;
};
