import mongoose, { Schema, Document } from "mongoose";

const Pharmacist = new Schema({
    firstName: String,
    lastName: String,
    fatherName: String,
    motherName: String,
    gender: String,
    nationalNumber: String,
    birthDate: Date,
    birthPlace: String,
    phoneNumber: String,
    address: String,
    graduationYear: Number,
    lastTimePaid: Date,
    nationality: String,

    registrationInfo: {
        ministerialNumber: Number,
        ministerialRegistrationDate: Date,
        registrationNumber: Number,
        registrationDate: Date,
    },

    licenses: [
        {
            _id: mongoose.Schema.Types.ObjectId,
            licenseType: String,
            startDate: Date,
            endDate: Date,
            details: String,
        },
    ],

    practiceRecords: [
        {
            _id: mongoose.Schema.Types.ObjectId,
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
            _id: mongoose.Schema.Types.ObjectId,
            degreeType: String,
            obtainingDate: Date,
            university: String,
        },
    ],
    penalties: [
        {
            _id: mongoose.Schema.Types.ObjectId,
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
export const licenseTypes = [""];
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

export const penaltyTypes = [""];

Pharmacist.virtual("fullName").get(function () {
    return `${this.firstName} ${this.fatherName} ${this.lastName}`;
});

export default mongoose.model("Pharmacist", Pharmacist, "pharmacists");
