import { ILicense, IPenalty, IPracticeRecord, ISyndicateRecord, IUniversityDegree } from "../../types/models/pharmacist.types";
import { dateUtils, formatDate } from "./../dateUtils";

const appendUniversityDegrees = (rows: Omit<IUniversityDegree, "images">[], HtmlContent: string): string => {
    const search = `<div id="universityDegrees" class="table-container"></div>`;
    let value = "";
    if (rows.length == 0) {
        value = `
        <div class="card-content">
            <div class="text-center py-8">
                <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;"
                    class="text-success">
                    <svg class="icon-large" viewBox="0 0 24 24" style="color: black;">
                        <circle cx="12" cy="8" r="7" />
                        <polyline points="8,21 12,17 16,21" />
                        <polyline points="12,17 12,21" />
                    </svg>
                    <span style="font-size: 1.125rem; font-weight: 500; color: black;">لا توجد
                        شهادات جامعية مسجلة</span>
                </div>
            </div>
        </div>
        `;
    } else {
        let result = ``;
        for (const row of rows) {
            result += `
            <tr>
                <td>${row.university}</td>
                <td>
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span>${dateUtils.formatDate(row.obtainingDate)}</span>
                    </div>
                </td>
                <td><span class="badge badge-secondary">${row.degreeType}</span></td>
            </tr>
        `;
        }
        value = `
        <div class="universityDegrees" style="padding: 0; overflow-x: auto;">
            <table class="table">
                <thead>
                    <tr>
                        <th>الجامعة</th>
                        <th>تاريخ الحصول</th>
                        <th>نوع الشهادة</th>
                    </tr>
                </thead>
                <tbody class="universityDegrees">
                ${result}
                </tbody>
            </table>
        </div>
        `;
    }
    return HtmlContent.replace(search, value);
};

const appendPracticeRecords = (rows: IPracticeRecord[], HtmlContent: string): string => {
    const search = `<div id="practiceRecords" class="table-container"></div>`;
    let value = "";
    if (rows.length == 0) {
        value = `
        <div class="card-content">
            <div class="text-center py-8">
                <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;"
                    class="text-success">
                    <svg class="icon-large" viewBox="0 0 24 24" style="color: black;">
                        <circle cx="12" cy="8" r="7" />
                        <polyline points="8,21 12,17 16,21" />
                        <polyline points="12,17 12,21" />
                    </svg>
                    <span style="font-size: 1.125rem; font-weight: 500; color: black;">لا توجد
                        مزاولات سابقة لهذا الصيدلي</span>
                </div>
            </div>
        </div>
        `;
    } else {
        let result = ``;
        for (const row of rows) {
            result += `
        <tr>
            <td>${row.syndicate}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span>${dateUtils.formatDate(row.startDate)} - ${row.endDate ? dateUtils.formatDate(row.endDate) : "إلى الأن"}</span>
                </div>
            </td>
            <td>${row.sector}</td>
            <td>${row.place}</td>
            <td><span class="badge badge-outline">${row.practiceType}</span></td>
        </tr>
        `;
        }
        value = `
        <div class="practiceRecords" style="padding: 0; overflow-x: auto;">
            <table class="table">
                <thead>
                    <tr>
                        <th>النقابة</th>
                        <th>الفترة</th>
                        <th>القطاع</th>
                        <th>مكان العمل</th>
                        <th>نوع الممارسة</th>
                    </tr>
                </thead>
                <tbody>
                ${result}
                </tbody>
            </table>
        </div>
        `;
    }
    return HtmlContent.replace(search, value);
};

const appendSyndicateRecords = (rows: ISyndicateRecord[], HtmlContent: string): string => {
    const search = `<div id="syndicateRecords" class="table-container"></div>`;
    let value = "";
    if (rows.length == 0) {
        value = `
        <div class="card-content">
            <div class="text-center py-8">
                <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;"
                    class="text-success">
                    <svg class="icon-large" viewBox="0 0 24 24" style="color: black;">
                        <circle cx="12" cy="8" r="7" />
                        <polyline points="8,21 12,17 16,21" />
                        <polyline points="12,17 12,21" />
                    </svg>
                    <span style="font-size: 1.125rem; font-weight: 500; color: black;">السجل النقابي فارغ</span>
                </div>
            </div>
        </div>
        `;
    } else {
        let result = ``;
        for (const row of rows) {
            result += `
        <tr>
            <td>${row.syndicate}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span>${dateUtils.formatDate(row.startDate)} - ${row.endDate ? dateUtils.formatDate(row.endDate) : "إلى الأن"}</span>
                </div>
            </td>
            <td><span class="badge">${row.registrationNumber}</span></td>
        </tr>
        `;
        }
        value = `
        <div class="syndicateRecords" style="padding: 0; overflow-x: auto;">
            <table class="table">
                <thead>
                    <tr>
                        <th>النقابة</th>
                        <th>الفترة</th>
                        <th>رقم التسجيل</th>
                    </tr>
                </thead>
                <tbody>
                ${result}
                </tbody>
            </table>
        </div>
        `;
    }
    return HtmlContent.replace(search, value);
};

const appendLicenses = (rows: ILicense[], HtmlContent: string): string => {
    const search = `<div id="licenses" class="table-container"></div>`;
    let value = "";
    if (rows.length == 0) {
        value = `
        <div class="card-content">
            <div class="text-center py-8">
                <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;"
                    class="text-success">
                    <svg class="icon-large" viewBox="0 0 24 24" style="color: black;">
                        <circle cx="12" cy="8" r="7" />
                        <polyline points="8,21 12,17 16,21" />
                        <polyline points="12,17 12,21" />
                    </svg>
                    <span style="font-size: 1.125rem; font-weight: 500; color: black;">لا توجد
                        تراخيص مسجلة</span>
                </div>
            </div>
        </div>
        `;
    } else {
        let result = ``;
        for (const row of rows) {
            result += `
        <tr>
            <td><span class="badge badge-outline">${row.licenseType}</span></td>
            <td>
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <span>${dateUtils.formatDate(row.startDate)} - ${row.endDate ? dateUtils.formatDate(row.endDate) : "إلى الأن"}</span>
                </div>
            </td>
            <td>${row.details || "لا يوجد"}</td>
        </tr>
        `;
        }

        value = `
        <div class="licenses" style="padding: 0; overflow-x: auto;">
            <table class="table">
                <thead>
                    <tr>
                        <th>نوع الترخيص</th>
                        <th>فترة الصلاحية</th>
                        <th>التفاصيل</th>
                    </tr>
                </thead>
                <tbody>
                ${result}
                </tbody>
            </table>
        </div>
        `;
    }

    return HtmlContent.replace(search, value);
};

const appendPenalties = (rows: IPenalty[], HtmlContent: string): string => {
    const search = `<div id="penalties" class="table-container"></div>`;
    let value = "";
    if (rows.length == 0) {
        value = `
        <div class="card-content">
            <div class="text-center py-8">
                <div style="display: flex; align-items: center; justify-content: center; gap: 0.5rem;"
                    class="text-success">
                    <svg class="icon-large" viewBox="0 0 24 24" style="color: black;">
                        <circle cx="12" cy="8" r="7" />
                        <polyline points="8,21 12,17 16,21" />
                        <polyline points="12,17 12,21" />
                    </svg>
                    <span style="font-size: 1.125rem; font-weight: 500; color: black;">لا توجد
                        عقوبات مسجلة</span>
                </div>
            </div>
        </div>
        `;
    } else {
        let result = ``;
        for (const row of rows) {
            result += `
        <tr>
            <td>${row.penaltyType}</td>
            <td>${dateUtils.formatDate(row.date)}</td>
            <td>${row.reason || "سبب مجهول"}</td>
            <td>${row.details || "لا يوجد تفاصيل"}</td>
        </tr>
        `;
        }
        value = `
        <div class="penalties" style="padding: 0; overflow-x: auto;">
            <table class="table">
                <thead>
                    <tr>
                        <th>نوع العقوبة</th>
                        <th>التاريخ</th>
                        <th>سبب العقوبة</th>
                        <th>التفاصيل</th>
                    </tr>
                </thead>
                <tbody>
                    ${result}
                </tbody>
            </table>
        </div>
        `;
    }
    return HtmlContent.replace(search, value);
};

export const pharmacistTamplate = {
    appendUniversityDegrees,
    appendPracticeRecords,
    appendLicenses,
    appendSyndicateRecords,
    appendPenalties,
};
