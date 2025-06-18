import Invoice from "../../models/Invoice.js";
import ExcelJS from "exceljs";
import { invoiceSchemaTR } from "../../translation/ar.js";

const exportInvoicesAsExcel = async (req, res, next) => {
    try {
        let queries = req.query;
        const page = parseInt(queries.page) || 1;
        const limit = parseInt(queries.limit) || 10;
        const skip = (page - 1) * limit;

        const allowedFilters = Object.keys(Invoice.schema.paths);

        queries = Object.fromEntries(
            Object.entries(queries).filter(([key, value]) => {
                return allowedFilters.includes(key);
            })
        );

        const result = await Invoice.find(queries).select("-fees").skip(skip).limit(limit).populate("practiceType pharmacist");

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Data Export");
        const excludedFields = ["fees", "__v", "_id"];

        const headers = Object.keys(Invoice.schema.paths).filter((value) => {
            return !excludedFields.includes(value);
        });
        worksheet.columns = headers.map((header) => ({
            header: invoiceSchemaTR[header],
            key: header,
            width: 25,
        }));

        result.forEach((doc) => {
            worksheet.addRow({
                ...doc.toObject(),
                pharmacist: doc.pharmacist.fullName,
                practiceType: doc.practiceType.name,
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
