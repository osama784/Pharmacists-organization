import { Document, HydratedDocument, Types } from "mongoose";
import { IInvoice } from "./invoice.types.js";

export interface ILicense {
    licenseType: string;
    startDate: Date;
    endDate: Date;
    details: string;
}

export interface IPracticeRecord {
    syndicate: string;
    startDate: Date;
    endDate: Date;
    sector: string;
    place: string;
    practiceType: string;
}
export interface ISyndicateRecord {
    syndicate: string;
    startDate: Date;
    endDate: Date;
}

export interface IUniversityDegree {
    degreeType: string;
    obtainingDate: Date;
    university: string;
}

export interface IPenalty {
    penaltyType: String;
    date: Date;
    reason: String;
    details: String;
}

export interface IPharmacist {
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

    licenses: ILicense[];
    practiceRecords: IPracticeRecord[];
    syndicateRecords: ISyndicateRecord[];
    universityDegrees: IUniversityDegree[];
    penalties: IPenalty[];

    invoices: Types.ObjectId[];
}

export type PharmacistDocument = HydratedDocument<IPharmacist> & {
    fullName: string;
    practiceState: string;
    syndicateMembershipStatus: string;
    currentSyndicate: string;
};
