export const syndicateMembershipsTR = {
    affiliation: "انتساب",
    "foreign-affiliation": "انتساب أجانب",
    "practicing-year": "سنة مزاول",
    "non-practicing-year": "سنة غير مزاول",
    "two-years-of-practicing": "سنتين مزاول",
    "two-years-of-non-practicing": "سنتين غير مزاول",
    "re-registration-of-practitioner": "إعادة قيد مزاول",
    "re-registration-of-non-practitioner": "إعادة قيد غير مزاول",
};

export const invoiceTR = {
    status: {
        paid: "مدفوع",
        ready: "جاهزة لللإرسال",
        cancelled: "ملغاة",
    },
    syndicateMembership: {
        "year of practicing": "سنة مزاول",
        "year of non-practicing": "سنة غير مزاول",
        "two years of non-practicing": "سنتين غير مزاول",
        "re-registration": "إعادة قيد",
        affiliation: "انتساب",
    },
};

export const InvoiceModelTR = {
    pharmacist: "اسم الصيدلي",
    status: "حالة الفاتورة",
    syndicateMembership: "نوع المزاولة",
    paidDate: "تاريخ الدفع",
    createdAt: "تاريخ إنشاء الفاتورة",
    total: "المجموع الكلي",
};

export interface IInvoiceModelTR {
    pharmacist: string;
    status: string;
    syndicateMembership: string;
    paidDate: string;
    createdAt: string;
    total: string;
}

export const IPharmacistModelTR = {
    firstName: "الاسم الأول",
    lastName: "الشهرة",
    fatherName: "اسم الأب",
    motherName: "اسم الأم",
    gender: "الجنس",
    nationalNumber: "الرقم الوطني",
    birthDate: "تاريخ الولادة",
    birthPlace: "مكان الولادة",
    phoneNumber: "رقم الجوال",
    address: "العنوان",
    graduationYear: "سنة التخرج",
    lastTimePaid: "تاريخ آخر دفع",
    nationality: "الجنسية",

    ministerialNumber: "الرقم الوزاري",
    ministerialRegistrationDate: "تاريخ التسجيل في الوزارة",
    registrationNumber: "الرقم النقابي",
    registrationDate: "تاريخ التسجيل في النقابة",
};

export interface IIPharmacistModelTR {
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
}

export const feesTranslation = {};
