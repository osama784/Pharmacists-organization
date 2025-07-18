import { HydratedDocument, Types } from "mongoose";

export interface ILicense {
    licenseType: string;
    date: Date;
    details?: string;
}

export interface IDossierStatuses {
    date: Date;
    details: string;
}

export interface IPracticeRecord {
    syndicate: string;
    startDate: Date;
    endDate?: Date;
    sector: string;
    place: string;
    practiceType: string;
}
export interface ISyndicateRecord {
    syndicate: string;
    startDate: Date;
    endDate: Date;
    registrationNumber: number;
}

export interface ICurrentSyndicate {
    syndicate: string;
    startDate: Date;
    registrationNumber: number;
}

export interface IUniversityDegree {
    degreeType: string;
    obtainingDate: Date;
    university: string;
}

export interface IPenalty {
    penaltyType: string;
    date: Date;
    reason?: string;
    details?: string;
}

export interface IPharmacist {
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

    currentSyndicate: ICurrentSyndicate | null;

    licenses: ILicense[];
    dossierStatuses: IDossierStatuses[];
    practiceRecords: IPracticeRecord[];
    syndicateRecords: ISyndicateRecord[];
    universityDegrees: IUniversityDegree[];
    penalties: IPenalty[];

    invoices: Types.ObjectId[];
}

export type PharmacistDocument = HydratedDocument<IPharmacist> & {
    createdAt: Date;
    updatedAt: Date;
} & {
    syndicateMembershipStatus: string;
    practiceState?: string;
    // currentSyndicate?: ISyndicateRecord;
};
