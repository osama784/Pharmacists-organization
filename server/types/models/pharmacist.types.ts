import { HydratedDocument, Model, Types } from "mongoose";

export interface ILicense {
    pharmacist: Types.ObjectId;
    relatedLease: Types.ObjectId;
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
}
export type LicenseDocument = HydratedDocument<ILicense> & {
    createdAt: Date;
    updatedAt: Date;
};

export interface ISyndicateRecord {
    pharmacist: Types.ObjectId;
    syndicate: string;
    startDate: Date;
    endDate?: Date | null;
    transferReason?: string | null;
    registrationNumber: string;
}
export type SyndicateRecordDocument = HydratedDocument<ISyndicateRecord> & {
    createdAt: Date;
    updatedAt: Date;
};

export interface IUniversityDegree {
    pharmacist: Types.ObjectId;
    degreeType: string;
    obtainingDate: Date;
    university: string;

    images: string[];
}
export type UniversityDegreeDocument = HydratedDocument<IUniversityDegree> & {
    createdAt: Date;
    updatedAt: Date;
};

export interface IPenalty {
    pharmacist: Types.ObjectId;
    penaltyType: string;
    date: Date;
    reason?: string | null;
    details?: string | null;
}
export type PenaltyDocument = HydratedDocument<IPenalty> & {
    createdAt: Date;
    updatedAt: Date;
};

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
    folderToken: string;

    integrity?: string | null;
    register?: string | null;
    oathTakingDate?: Date | null;
    deathDate?: Date | null;
    retirementDate?: Date | null;

    syndicateMembershipStatus?: string;
    practiceState?: string | null;
    currentSyndicate: Types.ObjectId;
    currentLicense?: Types.ObjectId | null;

    licenses: Types.ObjectId[];
    syndicateRecords: Types.ObjectId[];
    universityDegrees: Types.ObjectId[];
    penalties: Types.ObjectId[];

    invoices: Types.ObjectId[];
}

export type PharmacistDocument = HydratedDocument<IPharmacist> & {
    createdAt: Date;
    updatedAt: Date;
};
export type PopulatedPharmacistDocument = Omit<
    PharmacistDocument,
    "licenses" | "syndicateRecords" | "universityDegrees" | "penalties" | "currentSyndicate" | "currentLicense"
> & {
    currentSyndicate: SyndicateRecordDocument;
    currentLicense: LicenseDocument;
    licenses: LicenseDocument[];
    syndicateRecords: SyndicateRecordDocument[];
    universityDegrees: UniversityDegreeDocument[];
    penalties: PenaltyDocument[];
};

export interface IPharmacistModel extends Model<PharmacistDocument> {}
