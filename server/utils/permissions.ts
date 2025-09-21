const permissions = {
    createPharmacist: "إضافة صيدلي",
    updatePharmacist: "تعديل صيدلي",
    deletePharmacist: "حذف صيدلي",
    listPharmacists: "قراءة معلومات الصيدلي",
    getPharmacist: "قراءة معلومات الصيدلي",
    exportPharmacistsAsExcel: "تصدير معلومات الصيادلة على شكل إكسل",
    downloadPharmacistImages: "تحميل صور الصيدلي",
    printPharmacist: "طباعة معلومات الصيدلي",

    updateFeesValues: "تعديل معلومات الرسوم",
    listFees: "قراءة معلومات الرسوم",

    createInvoice: "إضافة فاتورة",
    updateInvoice: "تعديل فاتورة",
    deleteInvoice: "حذف فاتورة",
    listInvoices: "قراءة معلومات فاتورة",
    getInvoice: "قراءة معلومات فاتورة",
    exportInvoicesAsExcel: "تصدير معلومات الفواتير على شكل إكسل",
    downloadInvoiceImages: "تحميل صور الفاتورة",
    printInvoice: "طباعة معلومات الفاتورة",

    listUsers: "قراءة معلومات المستخدمين",
    readUser: "قراءة معلومات المستخدمين",
    createUser: "إضافة مستخدم",
    deleteUser: "حذف مستخدم",
    updateUser: "تعديل مستخدم",

    listRoles: "قراءة معلومات الأدوار",
    getRole: "قراءة معلومات الأدوار",
    createRole: "إضافة دور",
    deleteRole: "حذف دور",
    updateRole: "تعديل دور",
    listPermissions: "قراءة معلومات الأذونات",

    getInvoicesReport: "قراءة تقرير الفواتير",
    exportInvoicesReportAsExcel: "تصدير تقرير الفواتير على شكل إكسل",

    getDetailedPrints: "قراءة معلومات المطبوعات",
    updateDetailedPrints: "تعديل معلومات المطبوعات",
    updateFinesDate: "تعديل تاريخ الغرامات",
    updateReRegistrationtDate: "تعديل تاريخ إعادة القيد",

    getFixedDates: "قراءة معلومات التواريخ الثابتة",

    listBanks: "قراءة معلومات البنوك",
    getBank: "قراءة معلومات البنوك",
    createBank: "إنشاء بنك",
    updateBank: "تعديل بنك",
    deleteBank: "حذف بنك",

    printRegistryOfficeDocument: "طباعة وثيقة",
    readSecretary: "قراءة معلومات أمين السر",
    updateSecretary: "تعديل معلومات أمين السر",
    readPresident: "قراءة معلومات النقيب",
    updatePresident: "تعديل معلومات النقيب",

    listTreasuryFees: "قراءة معلومات رسوم الخزانة",
    getTreasuryFee: "قراءة معلومات رسم خزانة",
    createTreasuryFee: "إنشاء رسم خزانة",
    updateTreasuryFee: "تعديل رسم خزانة",
    deleteTreasuryFee: "حذف رسم خزانة",

    listTreasuryExpenditures: "قراءة معلومات النفقات",
    createTreasuryExpenditure: "إنشاء نفقة",
    updateTreasuryExpenditure: "تعديل نفقة",
    deleteTreasuryExpenditure: "حذف نفقة",

    listTreasuryIncomes: "قراءة معلومات الواردات",
    createTreasuryIncome: "إنشاء وارد",
    updateTreasuryIncome: "تعديل وارد",
    deleteTreasuryIncome: "حذف وارد",

    listTreasuryStamps: "قراءة معلومات الطوابع",
    createTreasuryStamp: "إنشاء طابع",
    updateTreasuryStamp: "تعديل طابع",
    deleteTreasuryStamp: "حذف طابع",

    listTreasuryReceipts: "قراءة معلومات فواتير الخزانة",
    getTreasuryReceipt: "قراءة معلومات فواتير خزانة",
    createTreasuryReceipt: "إنشاء فاتورة خزانة",
    updateTreasuryReceipt: "تعديل فاتورة خزانة",
    deleteTreasuryReceipt: "حذف فاتورة خزانة",
};

export const ReadablePermissions = {
    الصيدلي: [
        "إضافة صيدلي",
        "تعديل صيدلي",
        "حذف صيدلي",
        "قراءة معلومات الصيدلي",
        "تحميل صور الصيدلي",
        "تصدير معلومات الصيادلة على شكل إكسل",
        "طباعة معلومات الصيدلي",
    ],
    الرسوم: ["تعديل معلومات الرسوم", "قراءة معلومات الرسوم", "قراءة معلومات المطبوعات", "تعديل معلومات المطبوعات"],
    الفواتير: [
        "إضافة فاتورة",
        "تعديل فاتورة",
        "حذف فاتورة",
        "قراءة معلومات فاتورة",
        "تحميل صور الفاتورة",
        "تصدير معلومات الفواتير على شكل إكسل",
        "طباعة معلومات الفاتورة",
    ],
    المستخدمين: ["إضافة مستخدم", "تعديل مستخدم", "حذف مستخدم", "قراءة معلومات المستخدمين"],
    الأدوار: ["قراءة معلومات الأدوار", "قراءة معلومات الأذونات", "إضافة دور", "تعديل دور", "حذف دور"],
    "التواريخ الثابتة": ["تعديل تاريخ الغرامات", "تعديل تاريخ إعادة القيد", "قراءة معلومات التواريخ الثابتة"],
    التقارير: ["قراءة تقرير الفواتير", "تصدير تقرير الفواتير على شكل إكسل"],
    البنوك: ["قراءة معلومات البنوك", "إنشاء بنك", "تعديل بنك", "حذف بنك"],
    الديوان: ["طباعة وثيقة", "قراءة معلومات النقيب", "تعديل معلومات النقيب", "قراءة معلومات أمين السر", "تعديل معلومات أمين السر"],
    الصندوق: [
        "قراءة معلومات رسوم الخزانة",
        "قراءة معلومات رسم خزانة",
        "إنشاء رسم خزانة",
        "تعديل رسم خزانة",
        "حذف رسم خزانة",

        "قراءة معلومات النفقات",
        "إنشاء نفقة",
        "تعديل نفقة",
        "حذف نفقة",

        "قراءة معلومات الواردات",
        "إنشاء وارد",
        "تعديل وارد",
        "حذف وارد",

        "قراءة معلومات الطوابع",
        "إنشاء طابع",
        "تعديل طابع",
        "حذف طابع",

        "قراءة معلومات فواتير الخزانة",
        "إنشاء فاتورة خزانة",
        "تعديل فاتورة خزانة",
        "حذف فاتورة خزانة",
    ],
};

export default permissions;
