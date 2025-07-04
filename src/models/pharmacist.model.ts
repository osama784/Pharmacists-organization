import mongoose, { Schema, Document } from "mongoose";
import { PharmacistDocument } from "../types/models/pharmacist.types.js";

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
    address: {
        type: String,
        required: true,
    },
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
            organization: String,
            startDate: Date,
            endDate: Date,
            sector: String,
            place: String,
            characteristic: String,
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
    characteristic: [
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

Pharmacist.virtual("fullName").get(function (this: PharmacistDocument) {
    return `${this.firstName} ${this.fatherName} ${this.lastName}`;
});

export default mongoose.model<PharmacistDocument>("Pharmacist", Pharmacist, "pharmacists");
