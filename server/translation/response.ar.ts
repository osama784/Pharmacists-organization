import { TransferReason } from "../enums/pharmacist.enums";

export const responseMessages = {
    FORBIDDEN: "ليس لديك الصلاحية للقيام بهذا الأمر",
    INAVLID_JSON_RESPONSE: "عليك أن ترسل مفاتيح مع قيمها أو قائمة",
    INVALID_DATE_VALUE: "يجب أن تكون القيمة عبارة عن تاريخ",
    INVALID_STRING_VALUE: "يجب أن تكون القيمة نصاً",
    BAD_REQUEST: "بعض القيم مفقودة أو قيمتها غير مناسبة",
    UNIQUE_VALUE: "يجب أن تكون القيمة المرسلة فريدة",
    NOT_FOUND: "لم يتم إيجاد العنصر الذي تبحث عنه",
    SERVER_ERROR: "حدث خطأ ما في السيرفر",
    NO_FILE_UPLOADED: "لم يتم تحميل أي ملف",
    INVALID_FILE_SUFFIX: "لاحقة الملف المرسل ليست لاحقة صورة مناسبة",
    UNEXPECTED_FIELD_NAME: "يجب أن ترسل أسماء المفاتيح بشكل صحيح",
    BIG_SIZE_FILE: "حجم الملف أكبر من الحد المناسب",
    FEE_CONTROLLERS: {
        MISSING_VALUE_DETAIL: "يجب أن ترسل إما قيمة وحيدة أو ترسل قيم مفصلة على السنين لكل رسم",
        MISSING_VALUE: "يجب أن ترسل قيمة وحيدة من أجل الرسوم الثابتة",
        MISSING_SYNDICATE_MEMBERSHIP: "يجب عليك أن ترسل نوع رسم مناسب لإتمام حساب الرسوم المطلوبة",
        PROTECTED_FEES: "لا يمكنك التعديل على الرسوم الثابتة",
    },
    ROLE_CONTROLLERS: {
        UNIQUE_NAME: "يجب أن يكون اسم الدور فريد",
        PROTECTED_ROLES: "لا يمكنك تعديل أو حذف الأدوار الثابتة",
    },
    USER_CONTROLLERS: {
        UNIQUE_EMAIL: "يجب أن يكون الإيميل فريد",
        ROLE_NOT_FOUND: "لم يتم إيجاد دور برقم التعريف المعطى",
    },
    INVOICE_CONTROLLERS: {
        INVALID_STATUS: "قيمة حالة الفاتورة غير فعالة",
        NO_IMAGES_FOUND: "لا يوجد صور لهذه الفاتورة بعد",
    },
    AUTH_CONTROLLERS: {
        EMAIL_PASSWORD_INCORRECT: "الإيميل أو كلمة المرور غير صحيحة",
    },
    PHARMACIST_CONTROLLERS: {
        NO_IMAGES_FOUND: "لا يوجد صور لهذا الصيدلي بعد",
        PREVENT_ADDING_IMAGES_URLS: "لا يمكنك إضافة روابط لصور غير موجودة",
        NO_SYNICATE_FOUND: "لا يوجد نقابة كهذه في السجل النقابي",
        PHARMACIST_HAS_CURRENT_LICENSE: "هناك ترخيص فعال للصيدلي يجب إنهاؤه أولاً",
        NO_CURRENT_LICENSE_FOUND: "لا يوجد ترخيص حالي لهذا الصيدلي",
        CANT_TRANSFER_TO_SYNDICATE_BRANCH: "لا يمكن للصيدلي الانتقال مباشرة إلى فرع نقابة آخر، يجب تحويله للنقابة المركزية أولاً",
        CANT_TRANSFER_TO_SAME_SYNDICATE: "لا يمكن تحويل الصيدلي لنفس النقابة",
        SHOULD_RETURN_TO_SAME_SYNDICATE_BRANCH: "هناك ترخيص فعال للصيدلي، لذلك يجب تحوله للفرع النقابي الذي أنشأ ترخيصه فيه",
        TRANSFER_REASON_SHOULD_BE_TRANSFER_TO_BRANCH: `يجب أن يكون سبب النقل هو "${TransferReason.TRANSFER_TO_BRANCH}" عند النقل من النقابة المركزية إلى نقابة فرعية`,
        INVALID_TRANSFER_REASON: `يجب أن يكون سبب النقل قيمة مناسبة (${TransferReason.DEATH}، ${TransferReason.RETIREMENT}، ${TransferReason.CANCELLATION_OF_REGISTRATION}) للانتقال من فرع نقابة إلى المركزية`,
        CANT_CREATE_LICENSE_IN_CENTRAL_SYNDICATE: "لا يمكن أن يبدأ الصيدلي مزاولة من النقابة المركزية",
        CANT_DELETE_CURRENT_LICENSE: "هذا الترخيص فعال ولا يمكن حذفه، يجب إنهاء الترخيص أولاً",
        CANT_DELETE_CURRENT_SYNDICATE: "لا يمكن حذف النقابة الحالية للصيدلي",
    },
    REPORTS_CONTOLLERS: {
        MISSING_VALUES: "يجب عليك أن ترسل المعلومات الكاملة لإتمام إرسال التقارير المطلوبة",
        BAD_VALUES: "يجب عليك أن ترسل المعلومات بشكل صحيح لإتمام إرسال التقارير المطلوبة",
        SECTION_NOT_FOUND: "لم يتم إيجاد الصندوق الذي تبحث عنه",
    },
    BANK_CONTROLLERS: {
        INCOMPLETE_SECTION_INFO: "لم يتم إرسال المعلومات الكاملة للصناديق",
    },
    REGISTRY_OFFICE_CONTROLLERS: {
        BAD_REQUEST: "يجب عليك أن ترسل المعلومات كاملة بشكل صحيح لإتمام إرسال الوثيقة المطلوبة",
    },
    TREASURY_EXPENDITURE_CONTROLLERS: {
        PREVENT_ADDING_IMAGES_URLS: "لا يمكنك إضافة روابط لصور غير موجودة",
    },
    TREASURY_INCOMES_CONTROLLERS: {
        PREVENT_ADDING_IMAGES_URLS: "لا يمكنك إضافة روابط لصور غير موجودة",
    },
};
