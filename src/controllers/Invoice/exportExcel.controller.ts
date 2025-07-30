import Invoice from "../../models/invoice.model.js";
import ExcelJS from "exceljs";
import { IInvoiceModelTR, InvoiceModelTR } from "../../translation/models.ar.js";
import { NextFunction, Request, TypedResponse } from "express";
import { PharmacistDocument } from "../../types/models/pharmacist.types.js";
import IInvoiceQueries from "../../types/queries/invoice.query.js";
import buildInvoiceFilters from "./utils/buildInvoiceFilters.js";

const exportInvoicesAsExcel = async (req: Request, res: TypedResponse<null>, next: NextFunction) => {
    try {
        const queries = req.query as IInvoiceQueries;
        const page = parseInt(queries.page!) || 1;
        const limit = parseInt(queries.limit!) || 10;
        const skip = (page - 1) * limit;
        const filters = buildInvoiceFilters(queries);

        const result = await Invoice.find(filters).select("-fees").skip(skip).limit(limit).populate<{
            pharmacist: PharmacistDocument;
        }>("pharmacist");

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Data Export");
        const excludedFields = ["isFinesIncluded", "fees", "__v", "_id"];

        const headers = Object.keys(Invoice.schema.paths).filter((value) => {
            return !excludedFields.includes(value);
        });
        worksheet.columns = headers.map((header) => ({
            header: InvoiceModelTR[header as keyof IInvoiceModelTR],
            key: header,
            width: 25,
        }));

        result.forEach((doc) => {
            worksheet.addRow({
                ...doc.toObject(),
                pharmacist: doc.pharmacist.fullName,
                syndicateMembership: doc.syndicateMembership,
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

export default exportInvoicesAsExcel;
