import mongoose, { Schema, Document } from "mongoose";
import { ISyndicateRecord, PharmacistDocument } from "../types/models/pharmacist.types.js";
import { syndicateMembershipsTR } from "../translation/models.ar.js";

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
        nationalNumber: Number,
        birthDate: {
            type: Date,
            required: true,
        },
        birthPlace: String,
        phoneNumber: String,
        landlineNumber: Number,
        address: String,
        graduationYear: {
            type: Number,
            required: true,
        },
        lastTimePaid: Date,
        nationality: {
            type: String,
            required: true,
        },

        ministerialNumber: Number,
        ministerialRegistrationDate: Date,
        registrationNumber: { type: Number, required: true },
        registrationDate: { type: Date, required: true },

        integrity: String,
        register: String,
        oathTakingDate: Date,

        licenses: [
            {
                _id: false,
                licenseType: { type: String, required: true },
                date: { type: Date, required: true },
                details: String,
            },
        ],
        dossierStatuses: [
            {
                _id: false,
                date: { type: Date, required: true },
                details: { type: String, required: true },
            },
        ],
        practiceRecords: [
            {
                _id: false,
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
                _id: false,
                syndicate: { type: String, required: true },
                startDate: { type: Date, required: true },
                endDate: Date,
                registrationNumber: { type: Number, required: true },
            },
        ],
        universityDegrees: [
            {
                _id: false,
                degreeType: { type: String, required: true },
                obtainingDate: { type: Date, required: true },
                university: { type: String, required: true },
            },
        ],
        penalties: [
            {
                _id: false,
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
export const licenseTypes = ["دائم", "مؤقت"];
export const genders = ["ذكر", "أنثى"];
export const universityDegreeTypes = ["بكالوريوس صيدلة", "دبلوم صيدلة", "دكتوراه صيدلة", "ماجستير صيدلة"];
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

export const penaltyTypes = ["something"];

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

Pharmacist.pre("save", function (this: PharmacistDocument, next) {
    this.fullName = `${this.firstName} ${this.fatherName} ${this.lastName}`;
    next();
});

Pharmacist.virtual("syndicateMembershipStatus").get(function (this: PharmacistDocument): string {
    const lastTimePaid = this.lastTimePaid;
    if (!lastTimePaid) {
        return syndicateMembershipsTR.affiliation;
    }
    const lastTimePaidYear = lastTimePaid.getFullYear();
    const thisYear = new Date().getFullYear();
    const difference = thisYear - lastTimePaidYear;
    if (difference > 2) {
        return syndicateMembershipsTR["re-registration-of-non-practitioner"];
    }
    return syndicateMembershipsTR["affiliation"];

    // const practiceRecords = this.practiceRecords;
    // if (!practiceRecords || practiceRecords.length == 0) {
    // }
    // let start_year = lastTimePaidYear + 1;
    // let yearsOfPracticing = 0;
    // let yearsOfNonPracticing = 0;

    // while (start_year != thisYear + 1) {
    //     const exist = practiceRecords.filter(
    //         (value) => value.startDate.getFullYear() <= start_year && value.endDate.getFullYear() >= start_year
    //     );
    //     if (exist) {
    //         yearsOfPracticing += 1;
    //     } else {
    //         yearsOfNonPracticing += 1;
    //     }
    //     start_year += 1;
    // }

    // if (yearsOfPracticing + yearsOfNonPracticing == 1) {
    //     if (yearsOfPracticing == 1) {
    //         return syndicateMembershipsTR["practicing-year"];
    //     } else {
    //         return syndicateMembershipsTR["non-practicing-year"];
    //     }
    // } else if (yearsOfPracticing + yearsOfNonPracticing == 2) {
    //     if (yearsOfPracticing == 2) {
    //         return syndicateMembershipsTR["two-years-of-practicing"];
    //     } else {
    //         return syndicateMembershipsTR["two-years-of-non-practicing"];
    //     }
    // } else {
    //     // yearsOfPracticing + yearsOfNonPracticing >= 3
    //     if (yearsOfNonPracticing != 0) {
    //         return syndicateMembershipsTR["re-registration-of-non-practitioner"];
    //     } else {
    //         return syndicateMembershipsTR["re-registration-of-practitioner"];
    //     }
    // }
});

Pharmacist.virtual("practiceState").get(function (this: PharmacistDocument) {
    const practiceRecords = this.practiceRecords;
    if (!practiceRecords || practiceRecords.length == 0) {
        return undefined;
    }
    const lastPracticeRecord = practiceRecords.sort((a, b) => b.startDate.getTime() - a.startDate.getTime())[0];
    return lastPracticeRecord.practiceType;
});

Pharmacist.virtual("currentSyndicate").get(function (this: PharmacistDocument): ISyndicateRecord | null {
    const syndicateRecords = this.syndicateRecords;
    if (syndicateRecords.length == 0) {
        return null;
    }
    if (!syndicateRecords[0].endDate) {
        return syndicateRecords[0];
    }
    return null;
});

export default mongoose.model<PharmacistDocument>("Pharmacist", Pharmacist, "pharmacists");
