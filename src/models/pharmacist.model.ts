import mongoose, { Schema, Types } from "mongoose";
import { IPracticeRecord, PharmacistDocument } from "../types/models/pharmacist.types.js";
import { syndicateMembershipsTR } from "../translation/models.ar.js";

const Pharmacist = new Schema<PharmacistDocument>(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        fatherName: {
            type: String,
            required: true,
        },
        motherName: {
            type: String,
            required: true,
        },

        fullName: String,

        firstNameEnglish: String,
        lastNameEnglish: String,
        fatherNameEnglish: String,
        motherNameEnglish: String,
        gender: {
            type: String,
            required: true,
        },
        nationalNumber: String,
        birthDate: {
            type: Date,
            required: true,
        },
        birthPlace: String,
        phoneNumber: String,
        landlineNumber: String,
        address: String,
        graduationYear: {
            type: String,
            required: true,
        },
        lastTimePaid: Date,
        nationality: {
            type: String,
            required: true,
        },

        ministerialNumber: String,
        ministerialRegistrationDate: Date,
        registrationNumber: { type: String, required: true },
        registrationDate: { type: Date, required: true },

        integrity: String,
        register: String,
        oathTakingDate: Date,

        syndicateMembershipStatus: String,
        practiceState: String,
        currentSyndicate: {
            syndicate: String,
            startDate: Date,
            endDate: Date,
            registrationNumber: String,
        },

        licenses: [
            {
                _id: false,
                licenseType: { type: String, required: true },
                startDate: { type: Date, required: true },
                endDate: Date,
                details: String,
            },
        ],
        practiceRecords: [
            {
                _id: false,
                syndicate: { type: String, required: true },
                startDate: { type: Date, required: true },
                endDate: Date,
                sector: { type: String, required: true },
                place: { type: String, required: true },
                practiceType: { type: String, required: true },
            },
        ],
        syndicateRecords: [
            {
                _id: false,
                syndicate: { type: String, required: true },
                startDate: { type: Date, required: true },
                endDate: Date,
                registrationNumber: { type: String, required: true },
            },
        ],
        universityDegrees: [
            {
                _id: false,
                degreeType: { type: String, required: true },
                obtainingDate: { type: Date, required: true },
                university: { type: String, required: true },
            },
        ],
        penalties: [
            {
                _id: false,
                penaltyType: { type: String, required: true },
                date: { type: Date, required: true },
                reason: String,
                details: String,
            },
        ],

        invoices: {
            type: [Schema.Types.ObjectId],
            ref: "Invoice",
        },
    },
    { timestamps: true }
);
export const licenseTypes = ["دائم", "مؤقت"];
export const genders = ["ذكر", "أنثى"];
export const universityDegreeTypes = ["بكالوريوس صيدلة", "دبلوم صيدلة", "دكتوراه صيدلة", "ماجستير صيدلة"];
export const practiceRecordsInfo = {
    syndicate: [
        "نقابة الصيادلة المركزية",
        "نقابة صيادلة دمشق",
        "نقابة صيادلة السويداء",
        "نقابة صيادلة دير الزور",
        "نقابة صيادلة الحسكة",
        "نقابة صيادلة القامشلي",
        "نقابة صيادلة إدلب",
        "نقابة صيادلة الرقة",
        "نقابة صيادلة ريف دمشق",
        "نقابة صيادلة حلب",
        "نقابة صيادلة حمص",
        "نقابة صيادلة اللاذقية",
        "نقابة صيادلة طرطوس",
        "نقابة صيادلة حماة",
        "نقابة صيادلة درعا",
        "نقابة صيادلة القنيطرة",
    ],
    practiceType: [
        "مكاتب علمية-مندوبي دعاية",
        "قيد النقل",
        "متقاعد",
        "مزاولة",
        "في النقابة المركزية",
        "ترقين قيد",
        "صيدليات-خاصة",
        "صيدليات-عامة المعلمين او صيادلة عمالية",
        "إدارة فنية-صيدليات خاصة",
        "إدارة فنية-صيدليات عامة",
        "مستودعات-أدوية",
        "مستودعات-كيميائية",
        "مستودعات-بيطرية",
        "الموظفين-موظف",
        "الموظفين-مقيم",
        "الموظفين-معيد في كلية الصيدلة",
        "معامل الأدوية-مدير فني في معمل أدوية",
        "معامل الأدوية- رئيس خط إنتاج",
        "معامل الأدوية-صيدلي في معمل",
        "معامل الأدوية-منشأة مطهرات",
        "معامل الأدوية-شركة مبيدات حشرية",
        "معامل الأدوية-منشأة تجميل",
        "مخابر-خاصة",
        "مخابر-موظف+مخبر طبي",
        "متابعة الدراسة",
        "مكاتب علمية-مدراء فنيين",
        "مكاتب علمية-مندوبي دعاية",
        "خدمة إلزامية",
        "خارج القطر-عمل",
        "خارج القطر-دراسة",
        "مشطوب قيدهم",
        "بدون عمل",
        "أوضاع أخرى-صيدلي إضافي في صيدلية",
        "أوضاع أخرى-في مستودع",
    ],
};

export const syndicateRecordsInfo = {
    syndicate: [
        "نقابة الصيادلة المركزية",
        "نقابة صيادلة دمشق",
        "نقابة صيادلة السويداء",
        "نقابة صيادلة دير الزور",
        "نقابة صيادلة الحسكة",
        "نقابة صيادلة القامشلي",
        "نقابة صيادلة إدلب",
        "نقابة صيادلة الرقة",
        "نقابة صيادلة ريف دمشق",
        "نقابة صيادلة حلب",
        "نقابة صيادلة حمص",
        "نقابة صيادلة اللاذقية",
        "نقابة صيادلة طرطوس",
        "نقابة صيادلة حماة",
        "نقابة صيادلة درعا",
        "نقابة صيادلة القنيطرة",
    ],
};

export async function handlePharmacistFields(doc: PharmacistDocument): Promise<PharmacistDocument> {
    // handling "fullName"
    doc.fullName = `${doc.firstName} ${doc.fatherName} ${doc.lastName}`;

    // handling "syndicateMembershipStatus"
    const lastTimePaid = doc.lastTimePaid;
    if (!lastTimePaid) {
        doc.syndicateMembershipStatus = syndicateMembershipsTR.affiliation;
    }
    const lastTimePaidYear = lastTimePaid!.getFullYear();
    const thisYear = new Date().getFullYear();
    const difference = thisYear - lastTimePaidYear;
    if (difference > 2) {
        doc.syndicateMembershipStatus = syndicateMembershipsTR["re-registration-of-non-practitioner"];
    } else if (difference == 2) {
        doc.syndicateMembershipStatus = syndicateMembershipsTR["two-years-of-non-practicing"];
    } else if (difference == 1) {
        doc.syndicateMembershipStatus = syndicateMembershipsTR["non-practicing-year"];
    } else {
        doc.syndicateMembershipStatus = syndicateMembershipsTR["affiliation"];
    }

    const practiceRecords = doc.practiceRecords;
    // removing practice records that are related to a removed syndicate
    for (let i = practiceRecords.length - 1; i >= 0; i--) {
        const exist = doc.syndicateRecords.find((syndicateRecord) => syndicateRecord.syndicate == practiceRecords[i].syndicate);
        if (!exist) {
            practiceRecords.splice(i, 1);
        }
    }

    // assinging practiceRecords
    doc.practiceRecords = practiceRecords;

    // handling "practiceState"
    if (!practiceRecords || practiceRecords.length == 0) {
        doc.practiceState = null;
    }

    const lastPracticeRecord = practiceRecords.sort((a, b) => b.startDate.getTime() - a.startDate.getTime())[0];
    if (!lastPracticeRecord) {
        doc.practiceState = null;
    } else {
        doc.practiceState = lastPracticeRecord.practiceType;
    }

    await doc.save();
    return doc;
}

// Pharmacist.pre("save", function (this: PharmacistDocument, next) {
//     handlePharmacistFields(this);
//     next();
// });

// Pharmacist.pre(["updateOne", "findOneAndUpdate"], function (this: Query<any, PharmacistDocument>, next) {
//     const update = this.getUpdate()!;
//     const isUpdatingName = update.$set?.firstName || update.$set?.lastName;

//     if (isUpdatingName) {
//         // Use aggregation pipeline to compute fullName from updated/current values
//         const pipeline = [
//             {
//                 $set: {
//                     fullName: {
//                         $concat: [
//                             // Use updated firstName if provided, else existing value
//                             update.$set?.firstName ? update.$set.firstName : "$firstName",
//                             " ",
//                             update.$set?.lastName ? update.$set.lastName : "$lastName",
//                         ],
//                     },
//                 },
//             },
//         ];
//         this.setUpdate(pipeline);
//     }
//     next();
// });

// Pharmacist.virtual("syndicateMembershipStatus").get(function (this: PharmacistDocument): string {
//     const lastTimePaid = this.lastTimePaid;
//     if (!lastTimePaid) {
//         return syndicateMembershipsTR.affiliation;
//     }
//     const lastTimePaidYear = lastTimePaid.getFullYear();
//     const thisYear = new Date().getFullYear();
//     const difference = thisYear - lastTimePaidYear;
//     if (difference > 2) {
//         return syndicateMembershipsTR["re-registration-of-non-practitioner"];
//     } else if (difference == 2) {
//         return syndicateMembershipsTR["two-years-of-non-practicing"];
//     } else if (difference == 1) {
//         return syndicateMembershipsTR["non-practicing-year"];
//     }
//     return syndicateMembershipsTR["affiliation"];

// const practiceRecords = this.practiceRecords;
// if (!practiceRecords || practiceRecords.length == 0) {
// }
// let start_year = lastTimePaidYear + 1;
// let yearsOfPracticing = 0;
// let yearsOfNonPracticing = 0;

// while (start_year != thisYear + 1) {
//     const exist = practiceRecords.filter(
//         (value) => value.startDate.getFullYear() <= start_year && value.endDate.getFullYear() >= start_year
//     );
//     if (exist) {
//         yearsOfPracticing += 1;
//     } else {
//         yearsOfNonPracticing += 1;
//     }
//     start_year += 1;
// }

// if (yearsOfPracticing + yearsOfNonPracticing == 1) {
//     if (yearsOfPracticing == 1) {
//         return syndicateMembershipsTR["practicing-year"];
//     } else {
//         return syndicateMembershipsTR["non-practicing-year"];
//     }
// } else if (yearsOfPracticing + yearsOfNonPracticing == 2) {
//     if (yearsOfPracticing == 2) {
//         return syndicateMembershipsTR["two-years-of-practicing"];
//     } else {
//         return syndicateMembershipsTR["two-years-of-non-practicing"];
//     }
// } else {
//     // yearsOfPracticing + yearsOfNonPracticing >= 3
//     if (yearsOfNonPracticing != 0) {
//         return syndicateMembershipsTR["re-registration-of-non-practitioner"];
//     } else {
//         return syndicateMembershipsTR["re-registration-of-practitioner"];
//     }
// }
// });

// Pharmacist.virtual("practiceState").get(function (this: PharmacistDocument) {
//     const practiceRecords = this.practiceRecords;
//     if (!practiceRecords || practiceRecords.length == 0) {
//         return undefined;
//     }
//     const lastPracticeRecord = practiceRecords.sort((a, b) => b.startDate.getTime() - a.startDate.getTime())[0];
//     return lastPracticeRecord.practiceType;
// });

// Pharmacist.virtual("currentSyndicate").get(function (this: PharmacistDocument): ISyndicateRecord | null {
//     const syndicateRecords = this.syndicateRecords;
//     if (syndicateRecords.length == 0) {
//         return null;
//     }
//     if (!syndicateRecords[0].endDate) {
//         return syndicateRecords[0];
//     }
//     return null;
// });

export default mongoose.model<PharmacistDocument>("Pharmacist", Pharmacist, "pharmacists");
