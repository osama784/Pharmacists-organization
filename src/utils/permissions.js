// const permissions = [
//     "إضافة/حذف/تعديل مستخدم",
//     "إضافة/حذف إذن",
//     "إضافة/حذف دور",
//     "إضافة/حذف/تعديل صيدلي",
//     "قراءة معلومات الصيدلي",

//     "قراءة معلومات فاتورة",
//     "إضافة/حذف/تعديل فاتورة",

//     "تعديل معلومات الرسم",
//     "قراءة معلومات الرسوم",

//     "",
//     "",
//     "",
//     "",
//     "",
//     "",
//     "",
//     "",
//     "",
// ];

const permissions = {
    createPharmacist: "إضافة/حذف/تعديل صيدلي",
    updatePharmacist: "إضافة/حذف/تعديل صيدلي",
    deletePharmacist: "إضافة/حذف/تعديل صيدلي",
    listPharmacists: "قراءة معلومات الصيدلي",

    changeFeesValues: "إضافة/حذف/تعديل مستخدم",
    listFees: "قراءة معلومات الرسوم",

    createInvoice: "إضافة/حذف/تعديل فاتورة",
    updateInvoice: "إضافة/حذف/تعديل فاتورة",
    deleteInvoice: "إضافة/حذف/تعديل فاتورة",
    changeInvoiceStatus: "إضافة/حذف/تعديل فاتورة",
    listInvoices: "قراءة معلومات فاتورة",
    getInvoice: "قراءة معلومات فاتورة",

    createUser: "إضافة/حذف/تعديل مستخدم",
    deleteUser: "إضافة/حذف/تعديل مستخدم",
    updateUser: "إضافة/حذف/تعديل مستخدم",

    assignPermissions: "تعديل أذونات",

    createRole: "إضافة/حذف دور",
    deleteRole: "إضافة/حذف دور",
};

export default permissions;
