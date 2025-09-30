import mongoose, { Schema, Types } from "mongoose";
import {
    ILicense,
    IPenalty,
    IPharmacistModel,
    ISyndicateRecord,
    IUniversityDegree,
    LicenseDocument,
    PenaltyDocument,
    PharmacistDocument,
    PopulatedPharmacistDocument,
    SyndicateRecordDocument,
    UniversityDegreeDocument,
} from "../types/models/pharmacist.types.js";
import { syndicateMembershipsTR } from "../translation/models.ar.js";
import crypto from "crypto";
import { PracticeState } from "../enums/pharmacist.enums.js";

const pharmacistSchema = new Schema<PharmacistDocument>(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        fatherName: {
            type: String,
            required: true,
        },
        motherName: {
            type: String,
            required: true,
        },

        fullName: String,

        firstNameEnglish: String,
        lastNameEnglish: String,
        fatherNameEnglish: String,
        motherNameEnglish: String,
        gender: {
            type: String,
            required: true,
        },
        nationalNumber: { type: String, required: true },
        birthDate: {
            type: Date,
            required: true,
        },
        birthPlace: String,
        phoneNumber: { type: String, required: true },
        landlineNumber: String,
        address: String,
        graduationYear: {
            type: Date,
            required: true,
        },
        lastTimePaid: Date,
        nationality: {
            type: String,
            required: true,
        },

        ministerialNumber: String,
        ministerialRegistrationDate: Date,
        registrationNumber: { type: String, required: true },
        registrationDate: { type: Date, required: true },

        images: [String],
        folderToken: String,

        integrity: String,
        register: String,
        oathTakingDate: Date,

        deathDate: Date,
        retirementDate: Date,

        syndicateMembershipStatus: String,
        practiceState: { type: String, required: true, default: PracticeState.UNPRACTICED },
        currentSyndicate: {
            type: Schema.Types.ObjectId,
            ref: "SyndicateRecord",
            required: true,
        },
        currentLicense: {
            type: Schema.Types.ObjectId,
            ref: "License",
        },

        licenses: [
            {
                type: Schema.Types.ObjectId,
                ref: "License",
            },
        ],
        syndicateRecords: [
            {
                type: Schema.Types.ObjectId,
                ref: "SyndicateRecord",
            },
        ],
        universityDegrees: [
            {
                type: Schema.Types.ObjectId,
                ref: "UniversityDegree",
            },
        ],
        penalties: [
            {
                type: Schema.Types.ObjectId,
                ref: "Penalty",
            },
        ],

        invoices: {
            type: [Schema.Types.ObjectId],
            ref: "Invoice",
        },
    },
    { timestamps: true }
);

pharmacistSchema.pre("validate", async function (next) {
    if (this.isNew) {
        try {
            this.folderToken = crypto.randomBytes(32).toString("hex");
            next();
        } catch (e) {
            next(e as Error);
        }
    } else {
        next();
    }
});

export async function handlePharmacistFields(doc: PharmacistDocument | PopulatedPharmacistDocument) {
    // handling "fullName"
    doc.fullName = `${doc.firstName} ${doc.fatherName} ${doc.lastName}`;

    // handling "syndicateMembershipStatus"
    const lastTimePaid = doc.lastTimePaid;
    if (!lastTimePaid) {
        doc.syndicateMembershipStatus = syndicateMembershipsTR.affiliation;
    } else {
        const lastTimePaidYear = lastTimePaid!.getFullYear();
        const thisYear = new Date().getFullYear();
        const difference = thisYear - lastTimePaidYear;
        if (difference > 2) {
            doc.syndicateMembershipStatus = syndicateMembershipsTR["re-registration-of-non-practitioner"];
        } else if (difference == 2) {
            doc.syndicateMembershipStatus = syndicateMembershipsTR["two-years-of-non-practicing"];
        } else if (difference == 1) {
            doc.syndicateMembershipStatus = syndicateMembershipsTR["non-practicing-year"];
        } else {
            doc.syndicateMembershipStatus = syndicateMembershipsTR["affiliation"];
        }
    }

    await doc.save();
    return doc;
}

export default mongoose.model<PharmacistDocument, IPharmacistModel>("Pharmacist", pharmacistSchema, "pharmacists");

const universityDegreeSchema = new Schema<UniversityDegreeDocument>(
    {
        pharmacist: { type: Schema.Types.ObjectId, required: true },
        degreeType: { type: String, required: true },
        obtainingDate: { type: Date, required: true },
        university: { type: String, required: true },

        images: [String],
    },
    { timestamps: true }
);

const syndicateRecordSchema = new Schema<SyndicateRecordDocument>(
    {
        pharmacist: { type: Schema.Types.ObjectId, required: true },
        syndicate: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: Date,
        transferReason: String,
        registrationNumber: { type: String, required: true },
    },
    { timestamps: true }
);

const licenseSchema = new Schema<LicenseDocument>(
    {
        pharmacist: { type: Schema.Types.ObjectId, required: true },
        relatedLease: { type: Schema.Types.ObjectId, required: true },
        syndicate: { type: String, required: true },
        licenseType: { type: String, required: true },
        practiceStartDate: { type: Date, required: true },
        licenseStartDate: { type: Date, required: true },
        practiceType: { type: String, required: true },
        practicePlace: { type: String, required: true },
        practiceSector: { type: String, required: true },
        endDate: Date,
        details: String,

        images: [String],
    },
    { timestamps: true }
);

const penaltySchema = new Schema<PenaltyDocument>(
    {
        pharmacist: { type: Schema.Types.ObjectId, required: true },
        penaltyType: { type: String, required: true },
        date: { type: Date, required: true },
        reason: String,
        details: String,
    },
    { timestamps: true }
);

export const universityDegreeModel = mongoose.model("UniversityDegree", universityDegreeSchema, "universityDegrees");
export const syndicateRecordModel = mongoose.model("SyndicateRecord", syndicateRecordSchema, "syndicateRecords");
export const licenseModel = mongoose.model("License", licenseSchema, "licenses");
export const penaltyModel = mongoose.model("Penalty", penaltySchema, "penalties");
