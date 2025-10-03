export const zodSchemasMessages = {
    INVALID_EMAIL: "يجب أن تكون القيمة إيميل",
    INVALID_STRING: "يجب أن تكون القيمة نصاً",
    EMPTY_STRING: "يجب ألا يكون النص فارغاً",
    INVALID_MONGOOSE_ID: "يجب أن تكون القيمة رقم تعريف بشكل مناسب",
    INVALID_NUMBER: "يجب أن تكون القيمة رقماً",
    INVALID_POSITIVE_NUMBER: "يجب أن تكون القيمة رقماً موجباً",
    INVALID_DATE: "يجب أن تكون القيمة عبارة عن تاريخ",
    INVALID_BOOLEAN: "يجب أن تكون القيمة عبارة عن صح أو خطأ",
    START_lt_END_DATE: "يجب أن يكون تاريخ البداية أكبر من تاريخ النهاية",
    INVALID_ENUM_VALUE(data: [string, ...string[]]) {
        return `يجب أن تكون القيمة المعطاة إحدى القيم: ${data.join(" | ")}`;
    },

    MIN(value: number) {
        return `يجب ألا تقل القيمة عن ${value} محارف`;
    },

    FEE_SCHEMA: {
        INVALID_DETAILS_RECORD: "يجب أن تكون قيم مفصلة على السنين لكل رسم من 1996 إلى السنة الحالية",
    },
    INVOICE_SCHEMA: {
        FEE_NAME_NOT_FOUND: "اسم الرسم هذا لا ينتمي لأي من الرسوم الموجودة",
        SECTION_NAME_NOT_FOUND: "اسم الصندوق هذا لا ينتمي لأي من الصناديق الموجودة",
        ALL_FEES_SHOULD_EXIST: "يجب أن تشمل القائمة جميع الرسوم",
    },
    PHARMACIST_SCHEMA: {
        DUPLICATE_SYNDICATE: "يجب عدم إضافة نقابة جديدة موجودة مسبقاً",
    },
    TREASURY_FEES_SCHEMA: {
        INVALID_FEES: "يجب أن تشمل قائمة الرسوم معلومات صحيحة",
    },
    LEASE_SCHEMA: {
        NOT_FOUND_STAFF_PHARMACISTS: "تم إرفاق رقم تعريف لصيدلي غير موجود",
    },
};
