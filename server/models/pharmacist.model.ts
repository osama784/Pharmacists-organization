import mongoose, { Schema, Types } from "mongoose";
import { IPharmacistModel, IPracticeRecord, PharmacistDocument } from "../types/models/pharmacist.types.js";
import { syndicateMembershipsTR } from "../translation/models.ar.js";
import crypto from "crypto";

const Pharmacist = new Schema<PharmacistDocument>(
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

        syndicateMembershipStatus: String,
        practiceState: String,
        currentSyndicate: {
            syndicate: String,
            startDate: Date,
            endDate: Date,
            registrationNumber: String,
        },

        licenses: [
            {
                licenseType: { type: String, required: true },
                startDate: { type: Date, required: true },
                endDate: Date,
                details: String,

                images: [String],
            },
        ],
        practiceRecords: [
            {
                syndicate: { type: String, required: true },
                startDate: { type: Date, required: true },
                endDate: Date,
                sector: { type: String, required: true },
                place: { type: String, required: true },
                practiceType: { type: String, required: true },
            },
        ],
        syndicateRecords: [
            {
                syndicate: { type: String, required: true },
                startDate: { type: Date, required: true },
                endDate: Date,
                registrationNumber: { type: String, required: true },
            },
        ],
        universityDegrees: [
            {
                degreeType: { type: String, required: true },
                obtainingDate: { type: Date, required: true },
                university: { type: String, required: true },

                images: [String],
            },
        ],
        penalties: [
            {
                penaltyType: { type: String, required: true },
                date: { type: Date, required: true },
                reason: String,
                details: String,
            },
        ],

        invoices: {
            type: [Schema.Types.ObjectId],
            ref: "Invoice",
        },
    },
    { timestamps: true }
);

Pharmacist.pre("save", async function (next) {
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

export const licenseTypes = ["دائم", "مؤقت"];
export enum GenderEnum {
    MALE = "ذكر",
    FEMALE = "أنثى",
}
export const genders = ["ذكر", "أنثى"];
export enum UniversityDegreesEnum {
    BACHELOR = "بكالوريوس صيدلة",
    DIPLOMA = "دبلوم صيدلة",
    PHD = "دكتوراه صيدلة",
    MASTERS = "ماجستير صيدلة",
    BOARD = "بورد صيدلة",
}
export const universityDegreeTypes = ["بكالوريوس صيدلة", "دبلوم صيدلة", "دكتوراه صيدلة", "ماجستير صيدلة", "بورد صيدلة"];
export const practiceRecordsInfo = {
    syndicate: [
        "نقابة الصيادلة المركزية",
        "نقابة صيادلة دمشق",
        "نقابة صيادلة السويداء",
        "نقابة صيادلة دير الزور",
        "نقابة صيادلة الحسكة",
        "نقابة صيادلة القامشلي",
        "نقابة صيادلة إدلب",
        "نقابة صيادلة الرقة",
        "نقابة صيادلة ريف دمشق",
        "نقابة صيادلة حلب",
        "نقابة صيادلة حمص",
        "نقابة صيادلة اللاذقية",
        "نقابة صيادلة طرطوس",
        "نقابة صيادلة حماة",
        "نقابة صيادلة درعا",
        "نقابة صيادلة القنيطرة",
    ],
    practiceType: [
        "مكاتب علمية-مندوبي دعاية",
        "قيد النقل",
        "متقاعد",
        "مزاولة",
        "في النقابة المركزية",
        "ترقين قيد",
        "صيدليات-خاصة",
        "صيدليات-عامة المعلمين او صيادلة عمالية",
        "إدارة فنية-صيدليات خاصة",
        "إدارة فنية-صيدليات عامة",
        "مستودعات-أدوية",
        "مستودعات-كيميائية",
        "مستودعات-بيطرية",
        "الموظفين-موظف",
        "الموظفين-مقيم",
        "الموظفين-معيد في كلية الصيدلة",
        "معامل الأدوية-مدير فني في معمل أدوية",
        "معامل الأدوية- رئيس خط إنتاج",
        "معامل الأدوية-صيدلي في معمل",
        "معامل الأدوية-منشأة مطهرات",
        "معامل الأدوية-شركة مبيدات حشرية",
        "معامل الأدوية-منشأة تجميل",
        "مخابر-خاصة",
        "مخابر-موظف+مخبر طبي",
        "متابعة الدراسة",
        "مكاتب علمية-مدراء فنيين",
        "مكاتب علمية-مندوبي دعاية",
        "خدمة إلزامية",
        "خارج القطر-عمل",
        "خارج القطر-دراسة",
        "مشطوب قيدهم",
        "بدون عمل",
        "أوضاع أخرى-صيدلي إضافي في صيدلية",
        "أوضاع أخرى-في مستودع",
    ],
};

export const syndicateRecordsInfo = {
    syndicate: [
        "نقابة الصيادلة المركزية",
        "نقابة صيادلة دمشق",
        "نقابة صيادلة السويداء",
        "نقابة صيادلة دير الزور",
        "نقابة صيادلة الحسكة",
        "نقابة صيادلة القامشلي",
        "نقابة صيادلة إدلب",
        "نقابة صيادلة الرقة",
        "نقابة صيادلة ريف دمشق",
        "نقابة صيادلة حلب",
        "نقابة صيادلة حمص",
        "نقابة صيادلة اللاذقية",
        "نقابة صيادلة طرطوس",
        "نقابة صيادلة حماة",
        "نقابة صيادلة درعا",
        "نقابة صيادلة القنيطرة",
    ],
};

export async function handlePharmacistFields(doc: PharmacistDocument): Promise<PharmacistDocument> {
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

export default mongoose.model<PharmacistDocument, IPharmacistModel>("Pharmacist", Pharmacist, "pharmacists");
