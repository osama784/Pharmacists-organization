const permissions = {
    createPharmacist: "إضافة/حذف/تعديل صيدلي",
    updatePharmacist: "إضافة/حذف/تعديل صيدلي",
    deletePharmacist: "إضافة/حذف/تعديل صيدلي",
    listPharmacists: "قراءة معلومات الصيدلي",
    getPharmacist: "قراءة معلومات الصيدلي",

    updateFeesValues: "تعديل معلومات الرسوم",
    listFees: "قراءة معلومات الرسوم",

    createInvoice: "إضافة/حذف/تعديل فاتورة",
    updateInvoice: "إضافة/حذف/تعديل فاتورة",
    deleteInvoice: "إضافة/حذف/تعديل فاتورة",
    updateInvoiceStatus: "إضافة/حذف/تعديل فاتورة",
    listInvoices: "قراءة معلومات فاتورة",
    getInvoice: "قراءة معلومات فاتورة",

    listPracticeTypes: "قراءة معلومات المزاولات",

    createUser: "إضافة/حذف/تعديل مستخدم",
    deleteUser: "إضافة/حذف/تعديل مستخدم",
    updateUser: "إضافة/حذف/تعديل مستخدم",

    assignPermissions: "تعديل أذونات",
    listPermissions: "قراءة معلومات الأذونات",

    updateFinesDate: "تعديل تاريخ الغرامات",
    updateRistrectDate: "تعديل تاريخ القيد",
    listFixedDates: "قراءة معلومات التواريخ الثابتة",

    createRole: "إضافة/حذف دور",
    deleteRole: "إضافة/حذف دور",
};

export const ReadablePermissions = {
    الصيدلي: ["إضافة/حذف/تعديل صيدلي", "قراءة معلومات الصيدلي"],
    الرسوم: ["تعديل معلومات الرسوم", "قراءة معلومات الرسوم"],
    الفواتير: ["إضافة/حذف/تعديل فاتورة", "قراءة معلومات فاتورة"],
    المزاولات: ["قراءة معلومات المزاولات"],
    المستخدمين: ["إضافة/حذف/تعديل مستخدم", "تعديل أذونات", "قراءة معلومات الأذونات", "إضافة/حذف دور"],
    "التواريخ الثابتة": ["تعديل تاريخ الغرامات", "تعديل تاريخ القيد"],
};

export default permissions;
