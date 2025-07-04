export const invoiceTR = {
    status: {
        paid: "مدفوع",
        ready: "جاهزة لللإرسال",
        cancelled: "ملغاة",
    },
    practiceType: {
        "year of practicing": "سنة مزاول",
        "year of non-practicing": "سنة غير مزاول",
        "two years of non-practicing": "سنتين غير مزاول",
        "re-registration": "إعادة قيد",
        affiliation: "انتساب",
    },
};

export const invoiceSchemaTR = {
    pharmacist: "اسم الصيدلي",
    status: "حالة الفاتورة",
    practiceType: "نوع المزاولة",
    paidDate: "تاريخ الدفع",
    createdAt: "تاريخ إنشاء الفاتورة",
    total: "المجموع الكلي",
};

export interface IInvoiceSchemaTR {
    pharmacist: string;
    status: string;
    practiceType: string;
    paidDate: string;
    createdAt: string;
    total: string;
}

export const pharmacistSchemaTR = {
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

export interface IPharmacistSchemaTR {
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
