import { GenderEnum, UniversityDegreesEnum } from "../../models/pharmacist.model";
import { PharmacistDocument } from "../../types/models/pharmacist.types";
import { dateUtils } from "../dateUtils";

export enum SignerEnum {
    Captain = "نقيب صيادلة سوريا",
    Secretary = "أمين سر صيادلة سوريا",
    Both = "كلاهما",
}

export const SignerTypes = ["نقيب صيادلة سوريا", "أمين سر صيادلة سوريا", "كلاهما"];

export enum RegistryOfficePrintsTypesEnum {
    GoodBehavior = "حسن سيرة و سلوك",
    PractitionerGoodBehavior = "حسن سيرة و سلوك مزاول",
    UnRegistered = "غير مسجل في النقابة",
    BoardCertification = "شهادة البورد السوري",
    PermanentLicense = "ترخيص دائم",
    TravelPermit = "إذن سفر",
    SyndicateTransfer = "تحويلة الوزارة بدل ضائع",
}

export const RegistryOfficePrintsTypes = [
    "حسن سيرة و سلوك",
    "حسن سيرة و سلوك مزاول",
    "غير مسجل في النقابة",
    "شهادة البورد السوري",
    "ترخيص دائم",
    "إذن سفر",
    "تحويلة الوزارة بدل ضائع",
];

export function fillMainContent(
    templateType: RegistryOfficePrintsTypesEnum,
    info: { pharmacist: PharmacistDocument; additionalContent?: string; travelPlace?: string; travelReason?: string; registered?: boolean }
) {
    const BachelorDegree = info.pharmacist.universityDegrees.find((element) => element.degreeType == UniversityDegreesEnum.BACHELOR);
    const BoardDegree = info.pharmacist.universityDegrees.find((element) => element.degreeType == UniversityDegreesEnum.BOARD);
    switch (templateType) {
        case RegistryOfficePrintsTypesEnum.GoodBehavior:
            return `
        <p>
            إن ${info.pharmacist.gender == GenderEnum.MALE ? "الصيدلاني" : "الصيدلانية"} <strong>${
                info.pharmacist.fullName
            }</strong> مواليد ${info.pharmacist.birthDate.getFullYear()} ${
                info.pharmacist.gender == GenderEnum.MALE ? "حائز" : "حائزة"
            } على إجازة في 
            الصيدلة والكيمياء الصيدلانية من ${
                info.pharmacist.universityDegrees[0].university
            } ${info.pharmacist.universityDegrees[0].obtainingDate.getFullYear()} و${
                info.pharmacist.gender == GenderEnum.MALE ? "مسجل" : "مسجلة"
            } في 
            سجلات وزارة الصحة برقم ${info.pharmacist.ministerialNumber} بتاريخ ${dateUtils.formatDate(
                info.pharmacist.ministerialRegistrationDate!
            )} ومسجل لدى ${info.pharmacist.currentSyndicate?.syndicate}  بتاريخ ${dateUtils.formatDate(
                info.pharmacist.currentSyndicate?.startDate!
            )}، و${info.pharmacist.gender == GenderEnum.MALE ? "هو" : "هي"} ${
                info.pharmacist.gender == GenderEnum.MALE ? "بريء" : "بريئة"
            } الذمة لغاية ${new Date().getFullYear()}.
        </p>
        
        <p>
            وحق ${info.pharmacist.gender == GenderEnum.MALE ? "للصيدلاني" : "للصيدلانية"} ${
                info.pharmacist.gender == GenderEnum.MALE ? "المذكور" : "المذكورة"
            } مزاولة المهنة في الجمهورية العربية السورية وفق القوانين 
            والأنظمة النافذة، و${info.pharmacist.gender == GenderEnum.MALE ? "هو" : "هي"} ${
                info.pharmacist.gender == GenderEnum.MALE ? "حسن" : "حسنة"
            } السيرة والسلوك.
        </p>
        
        <strong style="text-align: center;" class="underlined">
            وبناء على ${info.pharmacist.gender == GenderEnum.MALE ? "طلبه" : "طلبها"} ${
                info.pharmacist.gender == GenderEnum.MALE ? "أعطي" : "أعطيت"
            } هذه الوثيقة.
        </strong>
        `;

        case RegistryOfficePrintsTypesEnum.UnRegistered:
            return `
            <p>لدى الرجوع إلى سجلات النقابة المركزية تبين أن ${info.pharmacist.gender == GenderEnum.MALE ? "السيد" : "السيدة"} ${
                info.pharmacist.firstName + " " + info.pharmacist.lastName
            } ${info.pharmacist.gender == GenderEnum.MALE ? "بن" : "بنت"} ${info.pharmacist.fatherName} مواليد ${dateUtils.formatDate(
                info.pharmacist.birthDate
            )} غير ${info.pharmacist.gender == GenderEnum.MALE ? "مسجل" : "مسجلة"} لدى نقابة صيادلة سوريا ولا أي فرع آخر.</p>
            <p><strong>وبناء على ${info.pharmacist.gender == GenderEnum.MALE ? "طلبه" : "طلبها"} ${
                info.pharmacist.gender == GenderEnum.MALE ? "أعطي" : "أعطيت"
            } هذه الوثيقة</strong></p>
            `;

        case RegistryOfficePrintsTypesEnum.BoardCertification:
            return `
            <p>إن ${
                info.pharmacist.gender == GenderEnum.MALE ? "الصيدلاني" : "الصيدلانية"
            } فلانة مواليد ${info.pharmacist.birthDate.getFullYear()} حائزة على إجازة في الصيدلة و الكيمياء من ${
                BoardDegree?.university
            } عام ${BoardDegree?.obtainingDate.getFullYear()} و مسجلة في سجلات وزارة الصحة برقم ${
                info.pharmacist.ministerialNumber
            } تاريخ ${info.pharmacist.ministerialRegistrationDate?.getFullYear()} و مسجلة لدى ${
                info.pharmacist.currentSyndicate ? info.pharmacist.currentSyndicate.syndicate : "نقابة صيادلة سوريا المركزية"
            } برقم ${
                info.pharmacist.currentSyndicate ? info.pharmacist.currentSyndicate.registrationNumber : info.pharmacist.registrationNumber
            } تاريخ ${
                info.pharmacist.currentSyndicate
                    ? dateUtils.formatDate(info.pharmacist.currentSyndicate.startDate)
                    : dateUtils.formatDate(info.pharmacist.registrationDate)
            } و مسددة لكاقة رسومها النقابية عام ${new Date().getFullYear()}</p>
            <p><strong>وبناء على طلبها أعطيت هذه الوثيقة للحصول على البورد السوري من قبل الهيئة السورية للاختصاصات الطبية.</strong></p>
            `;

        case RegistryOfficePrintsTypesEnum.PractitionerGoodBehavior:
            return `
            <p>إن ${info.pharmacist.gender == GenderEnum.MALE ? "الصيدلاني" : "الصيدلانية"} ${
                info.pharmacist.firstName + " " + info.pharmacist.lastName
            } ${info.pharmacist.gender == GenderEnum.MALE ? "بن" : "بنت"} ${
                info.pharmacist.fatherName
            } مواليد ${info.pharmacist.birthDate.getFullYear()} ${
                info.pharmacist.gender == GenderEnum.MALE ? "حائز" : "حائزة"
            } على إجازة في الصيدلة و الكيمياء من ${BachelorDegree?.university} عام ${BachelorDegree?.obtainingDate.getFullYear()} ${
                info.pharmacist.gender == GenderEnum.MALE ? "مسجل" : "مسجلة"
            } في سجلات وزارة الصحة برقم ${info.pharmacist.ministerialNumber} تاريخ ${dateUtils.formatDate(
                info.pharmacist.ministerialRegistrationDate!
            )} و${info.pharmacist.gender == GenderEnum.MALE ? "مسجل" : "مسجلة"} لدى ${
                info.pharmacist.currentSyndicate ? info.pharmacist.currentSyndicate.syndicate : "نقابة صيادلة سوريا المركزية"
            } برقم ${
                info.pharmacist.currentSyndicate ? info.pharmacist.currentSyndicate.registrationNumber : info.pharmacist.registrationNumber
            } تاريخ ${
                info.pharmacist.currentSyndicate
                    ? dateUtils.formatDate(info.pharmacist.currentSyndicate.startDate)
                    : dateUtils.formatDate(info.pharmacist.registrationDate)
            } ${info.additionalContent}.</p>
            <p>وإن ${info.pharmacist.gender == GenderEnum.MALE ? "الصيدلاني" : "الصيدلانية"} ${
                info.pharmacist.gender == GenderEnum.MALE ? "المذكور" : "المذكورة"
            } لم يسجل في ${info.pharmacist.gender == GenderEnum.MALE ? "إضبارته" : "إضبارتها"} أي عقوبة مهنية أو مسلكية لغاية ${
                info.pharmacist.gender == GenderEnum.MALE ? "تاريخه" : "تاريخها"
            }.</p>
            <strong>وبناء على ${info.pharmacist.gender == GenderEnum.MALE ? "طلبه" : "طلبها"} ${
                info.pharmacist.gender == GenderEnum.MALE ? "أعطي" : "أعطيت"
            } هذه الوثيقة.</strong>
            `;

        case RegistryOfficePrintsTypesEnum.PermanentLicense:
            return `
            <p>إن ${info.pharmacist.gender == GenderEnum.MALE ? "الصيدلاني" : "الصيدلانية"} ${
                info.pharmacist.firstName + " " + info.pharmacist.lastName
            } ${info.pharmacist.gender == GenderEnum.MALE ? "بن" : "بنت"} ${
                info.pharmacist.fatherName
            } مواليد ${info.pharmacist.birthDate.getFullYear()} ${
                info.pharmacist.gender == GenderEnum.MALE ? "حائز" : "حائزة"
            } على إجازة في الصيدلة و الكيمياء من ${BachelorDegree?.university} عام ${BachelorDegree?.obtainingDate.getFullYear()} ${
                info.pharmacist.gender == GenderEnum.MALE ? "مسجل" : "مسجلة"
            } في سجلات وزارة الصحة برقم ${info.pharmacist.ministerialNumber} تاريخ ${dateUtils.formatDate(
                info.pharmacist.ministerialRegistrationDate!
            )} و${info.pharmacist.gender == GenderEnum.MALE ? "مسجل" : "مسجلة"} لدى ${
                info.pharmacist.currentSyndicate ? info.pharmacist.currentSyndicate.syndicate : "نقابة صيادلة سوريا المركزية"
            } تاريخ ${
                info.pharmacist.currentSyndicate
                    ? dateUtils.formatDate(info.pharmacist.currentSyndicate.startDate)
                    : dateUtils.formatDate(info.pharmacist.registrationDate)
            } &#1548; و ${info.pharmacist.gender == GenderEnum.MALE ? "هو بريء" : "هي بريئة"} الذمة لغاية ${new Date().getFullYear()}.</p>
            <strong>وبناء على طلبها أعطيت هذه الوثيقة للحصول على الترخيص الدائم.</strong>
            `;

        case RegistryOfficePrintsTypesEnum.TravelPermit:
            return `
            <p>يسمح ${info.pharmacist.gender == GenderEnum.MALE ? "للصيدلاني" : "للصيدلانية"} ${
                info.pharmacist.firstName + " " + info.pharmacist.lastName
            } ${info.pharmacist.gender == GenderEnum.MALE ? "بن" : "بنت"} ${
                info.pharmacist.fatherName
            } بمغادرة الجمهورية العربية السورية والدخول إلى ${info.travelPlace} (${info.travelReason}).</p>
            <p>وإن ${info.pharmacist.gender == GenderEnum.MALE ? "الصيدلاني" : "الصيدلانية"} ${
                info.pharmacist.gender == GenderEnum.MALE ? "المذكور" : "المذكورة"
            } ${info.pharmacist.gender == GenderEnum.MALE ? "مسجل" : "مسجلة"} لدى ${
                info.pharmacist.currentSyndicate ? info.pharmacist.currentSyndicate.syndicate : "نقابة صيادلة سوريا المركزية"
            } وتحمل الهوية النقابية برقم ${
                info.pharmacist.currentSyndicate ? info.pharmacist.currentSyndicate.registrationNumber : info.pharmacist.registrationNumber
            } بتاريخ تسجيل ${
                info.pharmacist.currentSyndicate
                    ? dateUtils.formatDate(info.pharmacist.currentSyndicate.startDate)
                    : dateUtils.formatDate(info.pharmacist.registrationDate)
            }.</p>
            `;

        case RegistryOfficePrintsTypesEnum.SyndicateTransfer:
            return `
            <p>إن ${info.pharmacist.gender == GenderEnum.MALE ? "الصيدلاني" : "الصيدلانية"} ${
                info.pharmacist.firstName + " " + info.pharmacist.lastName
            } ${info.pharmacist.gender == GenderEnum.MALE ? "بن" : "بنت"} ${
                info.pharmacist.fatherName
            } مواليد ${info.pharmacist.birthDate.getFullYear()} ${
                info.pharmacist.gender == GenderEnum.MALE ? "حائز" : "حائزة"
            } على إجازة في الصيدلة و الكيمياء من ${BachelorDegree?.university} عام ${BachelorDegree?.obtainingDate.getFullYear()}.</p>
            <p>${
                info.registered
                    ? (info.pharmacist.gender == GenderEnum.MALE ? "مسجل" : "مسجلة") +
                      " لدى نقابة صيادلة سوريا المركزية و " +
                      (info.pharmacist.gender == GenderEnum.MALE ? "مسجل" : "مسجلة") +
                      " لدى " +
                      info.pharmacist.currentSyndicate?.syndicate +
                      "."
                    : "غير " +
                      (info.pharmacist.gender == GenderEnum.MALE ? "مسجل" : "مسجلة") +
                      " لدى نقابة صيادلة سوريا المركزية وغير " +
                      (info.pharmacist.gender == GenderEnum.MALE ? "مسجل" : "مسجلة") +
                      " في أي فرع."
            }</p>
            <strong>وبناء على ${
                info.pharmacist.gender == GenderEnum.MALE ? "طلبه" : "طلبها"
            } أعطيت هذا البيان للحصول على تحويلة الوزارة بدل ضائع.</strong>
                `;
    }
}

export function fillSignutreContent(signer: SignerEnum) {
    return `
    <div class="signature-section">
        <div ${signer == SignerEnum.Both || signer == SignerEnum.Secretary ? "" : `style="display: none;"`} class="secretary">
            <div class="title">أمين سر صيادلة سوريا</div>
            <div class="name">الدكتور الصيدلاني محمود قصاص</div>
        </div>
        <div ${signer == SignerEnum.Both || signer == SignerEnum.Captain ? "" : `style="display: none;"`} class="captain">
            <div class="title">نقيب صيادلة سوريا</div>
            <div class="name">الدكتور الصيدلاني إبراهيم الإسماعيل</div>
        </div>
    </div>`;
}
