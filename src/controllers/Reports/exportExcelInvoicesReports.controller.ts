import { NextFunction, Request, TypedResponse } from "express";
import { responseMessages } from "../../translation/response.ar";
import Section from "../../models/section.model";
import Invoice from "../../models/invoice.model";
import { FeeDocument } from "../../types/models/fee.types";
import { InvoiceResponseDto, toInvoiceResponseDto } from "../../types/dtos/invoice.dto";
import ExcelJS from "exceljs";
// @ts-nocheck

const exportExcelInvoicesReport = async (
    req: Request,
    res: TypedResponse<(Omit<InvoiceResponseDto, "fees"> & { fees: { name: string; value: number; numOfYears: number }[] })[]>,
    next: NextFunction
) => {
    try {
        const { section, startDate, endDate } = req.query;
        const page = parseInt(req.query.page as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = page * limit;
        if (!section || !startDate || !endDate) {
            res.status(400).json({ success: false, details: [responseMessages.REPORTS_CONTOLLERS.MISSING_VALUES] });
            return;
        }
        if (
            typeof startDate != "string" ||
            typeof endDate != "string" ||
            typeof section != "string" ||
            isNaN(Date.parse(startDate)) ||
            isNaN(Date.parse(endDate))
        ) {
            res.status(400).json({ success: false, details: [responseMessages.REPORTS_CONTOLLERS.BAD_VALUES] });
            return;
        }
        const sectionDoc = await Section.findOne({ name: section }).populate<{ fees: FeeDocument[] }>("fees");
        if (!sectionDoc) {
            res.status(400).json({ success: false, details: [responseMessages.REPORTS_CONTOLLERS.SECTION_NOT_FOUND] });
            return;
        }
        const startDateParsed = new Date(startDate);
        const endDateParsed = new Date(endDate);
        const filter = { createdAt: { $gt: startDateParsed, $lt: endDateParsed } };
        const invoices = await Invoice.find(filter).skip(skip).limit(limit);

        const result: (Omit<InvoiceResponseDto, "fees"> & { fees: { name: string; value: number; numOfYears: number }[] })[] = [];
        for (const invoice of invoices) {
            const fees = invoice.fees.filter((fee) => {
                const exist = sectionDoc.fees.findIndex((element) => element.name == fee.name);
                return exist != -1 ? true : false;
            });
            result.push({ ...toInvoiceResponseDto(invoice), fees: fees! });
        }

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Data Export");
        console.log(result[0].fees);
        worksheet.columns = [
            {
                header: "دليل الفاتورة",
                key: "id",
                width: 25,
            },
        ].concat(
            result[0].fees.map((header) => ({
                header: header.name,
                key: header.name,
                width: 25,
            }))
        );

        result.forEach((doc) => {
            let fees: any = {};
            doc.fees?.forEach((fee) => {
                fees[fee.name] = fee.value;
            });
            worksheet.addRow({
                id: doc.id,
                ...fees,
            });
        });

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=Invoices_${page}_${limit}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (e) {
        next(e);
    }
};

export default exportExcelInvoicesReport;
