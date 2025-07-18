export const responseMessages = {
    INAVLID_JSON_RESPONSE: "عليك أن ترسل مفاتيح مع قيمها أو قائمة",
    INVALID_DATE_VALUE: "يجب أن تكون القيمة عبارة عن تاريخ",
    BAD_REQUEST: "بعض القيم مفقودة أو قيمتها غير مناسبة",
    UNIQUE_VALUE: "يجب أن تكون القيمة المرسلة فريدة",
    NOT_FOUND: "لم يتم إيجاد العنصر الذي تبحث عنه",
    SERVER_ERROR: "حدث خطأ ما في السيرفر",
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
    },
    INVOICE_CONTROLLERS: {
        INVALID_STATUS: "قيمة حالة الفاتورة غير فعالة",
    },
    AUTH_CONTROLLERS: {
        EMAIL_PASSWORD_INCORRECT: "الإيميل أو كلمة المرور غير صحيحة",
    },
};
