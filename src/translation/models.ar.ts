import { IFee } from "../types/models/fee.types";
import { IInvoice } from "../types/models/invoice.types";
import { IPharmacist } from "../types/models/pharmacist.types";
import { IRole } from "../types/models/role.types";
import { IUser } from "../types/models/user.types";

type Paths<T> = T extends object
    ? {
          [K in keyof T]: K extends string
              ? T[K] extends object
                  ? `${K}` | `${K}.${Paths<T[K]>}` // Include parent + nested paths
                  : K // Include leaf nodes
              : never;
      }[keyof T] // Convert to union
    : never;

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
type InvoiceModelTR = Record<keyof Omit<IInvoice, "isFinesIncluded">, any>;
export const InvoiceModelTR: InvoiceModelTR = {
    pharmacist: "اسم الصيدلي",
    status: "حالة الفاتورة",
    syndicateMembership: "نوع المزاولة",
    paidDate: "تاريخ الدفع",
    createdAt: "تاريخ إنشاء الفاتورة",
    total: "المجموع الكلي",
    fees: {
        name: "اسم الرسم",
        value: "قيمة الرسم",
    },
};
type PharmacistModelTR = Record<keyof Omit<IPharmacist, "invoices" | "currentSyndicate">, any>;
export const PharmacistModelTR: PharmacistModelTR = {
    firstName: "الاسم الأول",
    lastName: "الشهرة",
    fatherName: "اسم الأب",
    motherName: "اسم الأم",

    fullName: "الاسم الكامل",

    firstNameEnglish: "الاسم الأول بالإنجليزي",
    lastNameEnglish: "الشهرة بالإنجليزي",
    fatherNameEnglish: "اسم الأب بالإنجليزي",
    motherNameEnglish: "اسم الأم بالإنجليزي",

    gender: "الجنس",
    nationalNumber: "الرقم الوطني",
    birthDate: "تاريخ الولادة",
    birthPlace: "مكان الولادة",
    phoneNumber: "رقم الجوال",
    landlineNumber: "الرقم الأرضي",
    address: "العنوان",
    graduationYear: "سنة التخرج",
    lastTimePaid: "تاريخ آخر دفع",
    nationality: "الجنسية",

    ministerialNumber: "الرقم الوزاري",
    ministerialRegistrationDate: "تاريخ التسجيل في الوزارة",
    registrationNumber: "الرقم النقابي",
    registrationDate: "تاريخ التسجيل في النقابة",

    integrity: "الأمانة",
    register: "القيد",
    oathTakingDate: "تاريخ أداء اليمين",

    syndicateMembershipStatus: "مؤشر العضوية",
    practiceState: "نوع المزاولة",

    images: "صور عن المعلومات الشخصية",

    licenses: {
        licenseType: "نوع الترخيص",
        startDate: "تاريخ بداية الترخيص",
        endDate: "تاريخ نهاية الترخيص",
        details: "تفاصيل عن الترخيص",

        images: "صور عن الترخيص",
    },
    practiceRecords: {
        syndicate: "النقابة",
        startDate: "تاريخ بداية المزاولة",
        endDate: "تاريخ نهاية المزاولة",
        sector: "قطاع المزاولة",
        place: "مكان المزاولة",
        practiceType: "نوع المزاولة",
    },
    syndicateRecords: {
        syndicate: "النقابة",
        startDate: "تاريخ بداية السجل النقابي",
        endDate: "تاريخ نهاية السجل النقابي",
        registrationNumber: "رقم الانتساب النقابي",
    },
    universityDegrees: {
        degreeType: "نوع الشهادة",
        obtainingDate: "تاريخ استلام الشهادة",
        university: "الجامعة المانحة",
        images: "صور عن الشهادة",
    },
    penalties: {
        penaltyType: "نوع العقوبة",
        date: "تاريخ العقوبة",
        reason: "سبب العقوبة",
        details: "تفاصيل عن العقوبة",
    },
};

type FeeModelTR = Record<keyof Omit<IFee, "isMutable" | "isRepeatable">, string> & { id: string };
export const FeeModelTR: FeeModelTR = {
    id: "رقم تعريف الرسم",
    name: "اسم الرسم",
    section: "الصندوق",
    details: "تفاصيل قيم الرسم",
    value: "قيمة الرسم",
};

type RoleModelTR = Record<keyof IRole, any>;
export const RoleModelTR: RoleModelTR = {
    name: "اسم الدور",
    permissions: "أسماء الأذونات",
};

type UserModelTR = Record<keyof IUser, any>;
export const UserModelTR: UserModelTR = {
    username: "اسم المستخدم",
    email: "الإيميل",
    password: "كلمة المرور",
    role: "دور المستخدم",
    status: "حالة المستخدم",
    phoneNumber: "رقم الجوال",
    resetPasswordToken: "رمز التحقق",
};

export const AuthTR = {
    email: "الإيميل",
    password: "كلمة المرور",
    resetToken: "رمز التحقق",
};

export const modelsTR = {
    pharmacist: PharmacistModelTR,
    invoice: InvoiceModelTR,
};

export interface IModelsTR {
    pharmacist: PharmacistModelTR;
    invoice: InvoiceModelTR;
}
