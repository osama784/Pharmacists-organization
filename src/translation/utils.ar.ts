import multer from "multer";

export const MulterErrorTranslator = (code: multer.ErrorCode): string => {
    if (code == "LIMIT_FILE_SIZE") {
        return "يجب أن ترسل ملف ذو حجم مناسب";
    }
    if (code == "LIMIT_FILE_COUNT") {
        return "يجب أن يكون عدد الملفات المرسل تحت الحد المناسب";
    }
    if (code == "LIMIT_UNEXPECTED_FILE") {
        return "يجب أن ترسل اسم مفتاح الملف بشكل صحيح";
    }

    return "حدث خطأ ما عند رفع الملف";
};
