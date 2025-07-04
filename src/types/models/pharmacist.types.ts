import { Document, HydratedDocument, Types } from "mongoose";
import { IInvoice } from "./invoice.types.js";

interface ILicense {
    licenseType: string;
    startDate: Date;
    endDate: Date;
    details: string;
}

interface IPracticeRecord {
    organization: string;
    startDate: Date;
    endDate: Date;
    sector: string;
    place: string;
    characteristic: string;
}

interface IUniversityDegree {
    degreeType: string;
    obtainingDate: Date;
    university: string;
}

interface IPenalty {
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
    address: string;
    graduationYear: number;
    lastTimePaid: Date;
    nationality: string;
    ministerialNumber: number;
    ministerialRegistrationDate: Date;
    registrationNumber: number;
    registrationDate: Date;

    licenses: ILicense[];
    practiceRecords: IPracticeRecord[];
    universityDegrees: IUniversityDegree[];
    penalties: IPenalty[];

    invoices: Types.ObjectId[];
}

export type PharmacistDocument = HydratedDocument<IPharmacist> & {
    fullName: string;
};
