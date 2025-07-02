import { Document } from "mongoose";

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

interface IPharmacist {
    firstName: string;
    lastName: string;
    fatherName: string;
    motherName: string;
    gender: string;
    nationalNumber: number;
    birthDate: string;
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

    invoices: any;
}

export type PharmacistDocument = IPharmacist &
    Document & {
        fullName: string;
    };
