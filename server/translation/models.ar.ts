import { IBank } from "../types/models/bank.types";
import { IFee } from "../types/models/fee.types";
import { IInvoice } from "../types/models/invoice.types";
import { IPharmacist } from "../types/models/pharmacist.types";
import { IRole } from "../types/models/role.types";
import { ITreasuryExpenditure } from "../types/models/treasuryExpenditure.types";
import { ITreasuryFee } from "../types/models/treasuryFee.types";
import { ITreasuryReceipt } from "../types/models/treasuryReceipt.types";
import { ITreasuryIncome } from "../types/models/treasuryIncome.types";
import { ITreasuryStamp } from "../types/models/treasuryStamp.types";
import { IUser } from "../types/models/user.types";

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
    serialID: "رقم تعريف الفاتورة",
    receiptNumber: "رقم الإيصال",
    pharmacist: "الصيدلي",
    bank: "البنك",
    status: "حالة الفاتورة",
    syndicateMembership: "نوع المزاولة",
    paidDate: "تاريخ الدفع",
    createdAt: "تاريخ إنشاء الفاتورة",
    updatedAt: "تاريخ تعديل الفاتورة",
    total: "المجموع الكلي",
    fees: {
        name: "اسم الرسم",
        value: "قيمة الرسم",
        numOfYears: "عدد السنوات",
    },
    images: "صور الفاتورة",
};

export const ExtraInvoiceTR = {
    willPracticeThisYear: "سيزاول هذه السنة",
    calculateFines: "احتساب الغرامات",
};
type PharmacistModelTR = Record<keyof IPharmacist, any>;
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
    deathDate: "تاريخ الوفاة",
    retirementDate: "تاريخ التقاعد",

    currentSyndicate: "النقابة الحالية",
    currentLicense: "الترخيص الحالي",

    syndicateMembershipStatus: "مؤشر العضوية",
    practiceState: "نوع المزاولة",

    images: "صور عن المعلومات الشخصية",
    folderToken: "رمز الملف",

    licenses: {
        licenseType: "نوع الترخيص",
        licenseStartDate: "تاريخ بداية الترخيص",
        practiceStartDate: "تاريخ بداية المزاولة",
        practiceType: "صفة المزاولة",
        practiceSector: "قطاع المزاولة",
        practicePlace: "مكان المزاولة",
        endDate: "تاريخ نهاية الترخيص",
        details: "تفاصيل عن الترخيص",

        images: "صور عن الترخيص",
    },
    syndicateRecords: {
        syndicate: "النقابة",
        startDate: "تاريخ بداية السجل النقابي",
        endDate: "تاريخ نهاية السجل النقابي",
        transferReason: "سبب النقل",
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

    invoices: "الفواتير",
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

type BankModelTR = Record<keyof IBank, any>;
export const BankModelTR: BankModelTR = {
    name: "اسم البنك",
    accounts: {
        section: "اسم الصندوق",
        accountNum: "رقم الحساب",
    },
};

export const RegistryOfficeTR = {
    pharmacist: "الصيدلي",
    documentType: "نوع الوثيقة",
    signer: "الموقع",
    additionalContent: "النص المدخل",
    travelPlace: "مكان السفر",
    travelReason: "سبب السفر",
    registered: "هل هو مسجل",
};

type TreasuryFeeModelTR = Record<keyof ITreasuryFee, any>;
export const TreasuryFeeModelTR: TreasuryFeeModelTR = {
    name: "اسم الرسم",
    value: "قيمة الرسم",
    associatedParty: "الجهة المرتبطة",
    associatedSection: "الصندوق",
    receiptBook: "نوع دفتر الإيصالات",
};

type TreasuryExpenditureModelTR = Record<keyof ITreasuryExpenditure, any>;
export const TreasuryExpenditureModelTR: TreasuryExpenditureModelTR = {
    serialID: "الرقم التسلسلي",
    name: "اسم المصروف",
    value: "قيمة المصروف",
    associatedSection: "اسم الصندوق",
    images: "روابط الصور",
};

type TreasuryIncomeModelTR = Record<keyof ITreasuryIncome, any>;
export const TreasuryIncomeModelTR: TreasuryIncomeModelTR = {
    serialID: "الرقم التسلسلي",
    name: "اسم الوارد",
    value: "قيمة الوارد",
    associatedSection: "اسم الصندوق",
    images: "روابط الصور",
};

type TreasuryStampModelTR = Record<keyof ITreasuryStamp, any>;
export const TreasuryStampModelTR: TreasuryStampModelTR = {
    serialID: "الرقم التسلسلي",
    name: "اسم الطابع",
    value: "قيمة الطابع",
    initialQuantity: "الكمية الابتدائية",
    soldQuantity: "الكمية المباعة",
};

type TreasuryReceiptModelTR = Record<keyof ITreasuryReceipt, any>;
export const TreasuryReceiptModelTR: TreasuryReceiptModelTR = {
    serialID: "الرقم التسلسلي",
    pharmacist: "الصيدلي",
    receiptBook: "نوع دفتر الإيصالات",
    fees: {
        name: "اسم الرسم",
        value: "قيمة الرسم",
    },
    total: "القيمة الإجمالية",
};
