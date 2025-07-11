import mongoose, { Schema, Document } from "mongoose";
import { PharmacistDocument } from "../types/models/pharmacist.types.js";
import { practiceTypesTR } from "../translation/models.ar.js";

const Pharmacist = new Schema<PharmacistDocument>({
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
    gender: {
        type: String,
        required: true,
    },
    nationalNumber: {
        type: Number,
        required: true,
    },
    birthDate: {
        type: Date,
        required: true,
    },
    birthPlace: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
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

    ministerialNumber: { type: Number, required: true },
    ministerialRegistrationDate: { type: Date, required: true },
    registrationNumber: { type: Number, required: true },
    registrationDate: { type: Date, required: true },

    integrity: String,
    register: String,

    licenses: [
        {
            _id: false,
            licenseType: String,
            startDate: Date,
            endDate: Date,
            details: String,
        },
    ],

    practiceRecords: [
        {
            _id: false,
            syndicate: String,
            startDate: Date,
            endDate: Date,
            sector: String,
            place: String,
            practiceType: String,
        },
    ],
    syndicateRecords: [
        {
            _id: false,
            syndicate: String,
            startDate: Date,
            endDate: Date,
        },
    ],
    universityDegrees: [
        {
            _id: false,
            degreeType: String,
            obtainingDate: Date,
            university: String,
        },
    ],
    penalties: [
        {
            _id: false,
            penaltyType: String,
            date: Date,
            reason: String,
            details: String,
        },
    ],

    invoices: {
        type: [Schema.Types.ObjectId],
        ref: "Invoice",
    },
});
export const licenseTypes = ["something"];
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

export const syndicatesRecordsInfo = {
    organization: [
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

Pharmacist.virtual("fullName").get(function (this: PharmacistDocument): string {
    return `${this.firstName} ${this.fatherName} ${this.lastName}`;
});

Pharmacist.virtual("syndicateMembershipStatus").get(function (this: PharmacistDocument): string {
    const lastTimePaid = this.lastTimePaid;
    if (!lastTimePaid) {
        return practiceTypesTR.affiliation;
    }
    const lastTimePaidYear = lastTimePaid.getFullYear();
    const thisYear = new Date().getFullYear();
    const practiceRecords = this.practiceRecords;
    if (!practiceRecords || practiceRecords.length == 0) {
        const difference = thisYear - lastTimePaidYear;
        if (difference == 1) {
            return practiceTypesTR["non-practicing-year"];
        }
        if (difference == 2) {
            return practiceTypesTR["two-years-of-non-practicing"];
        }
        return practiceTypesTR["re-registration-of-non-practitioner"];
    }
    let start_year = lastTimePaidYear + 1;
    let yearsOfPracticing = 0;
    let yearsOfNonPracticing = 0;

    while (start_year != thisYear + 1) {
        const exist = practiceRecords.filter(
            (value) => value.startDate.getFullYear() <= start_year && value.endDate.getFullYear() >= start_year
        );
        if (exist) {
            yearsOfPracticing += 1;
        } else {
            yearsOfNonPracticing += 1;
        }
        start_year += 1;
    }

    if (yearsOfPracticing + yearsOfNonPracticing == 1) {
        if (yearsOfPracticing == 1) {
            return practiceTypesTR["practicing-year"];
        } else {
            return practiceTypesTR["non-practicing-year"];
        }
    } else if (yearsOfPracticing + yearsOfNonPracticing == 2) {
        if (yearsOfPracticing == 2) {
            return practiceTypesTR["two-years-of-practicing"];
        } else {
            return practiceTypesTR["two-years-of-non-practicing"];
        }
    } else {
        // yearsOfPracticing + yearsOfNonPracticing >= 3
        if (yearsOfNonPracticing != 0) {
            return practiceTypesTR["re-registration-of-non-practitioner"];
        } else {
            return practiceTypesTR["re-registration-of-practitioner"];
        }
    }
});

Pharmacist.virtual("practiceState").get(function (this: PharmacistDocument) {
    const practiceRecords = this.practiceRecords;
    if (!practiceRecords || practiceRecords.length == 0) {
        return undefined;
    }
    const lastPracticeRecord = practiceRecords.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())[0];
    return lastPracticeRecord.practiceType;
});

Pharmacist.virtual("currentSyndicate").get(function (this: PharmacistDocument) {
    const practiceRecords = this.practiceRecords;
    if (!practiceRecords || practiceRecords.length == 0) {
        return undefined;
    }
    const lastPracticeRecord = practiceRecords.sort((a, b) => a.startDate.getTime() - b.startDate.getTime())[0];
    return lastPracticeRecord.syndicate;
});

export default mongoose.model<PharmacistDocument>("Pharmacist", Pharmacist, "pharmacists");
