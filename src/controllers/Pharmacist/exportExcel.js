import Pharmacist from "../../models/Pharmacist.js";
import ExcelJS from "exceljs";
import { pharmacistSchemaTR } from "../../translation/ar.js";

const exportPharmacistsAsExcel = async (req, res, next) => {
    try {
        let queries = req.query;
        const page = parseInt(queries.page) || 1;
        const limit = parseInt(queries.limit) || 10;
        const skip = (page - 1) * limit;

        const allowedFilters = Object.keys(Pharmacist.schema.paths);

        queries = Object.fromEntries(
            Object.entries(queries).filter(([key, value]) => {
                return allowedFilters.includes(key);
            })
        );

        const result = await Pharmacist.find(queries)
            .select("-invoices -licenses -universityDegrees -penalties -practiceRecords")
            .skip(skip)
            .limit(limit);

        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Data Export");
        const excludedFields = ["invoices", "licenses", "universityDegrees", "penalties", "practiceRecords", "__v", "_id"];

        const headers = Object.keys(Pharmacist.schema.paths).filter((value) => {
            return !excludedFields.includes(value);
        });
        worksheet.columns = headers.map((header) => ({
            header: pharmacistSchemaTR[header],
            key: header,
            width: 25,
        }));

        result.forEach((doc) => {
            worksheet.addRow(doc);
        });

        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", `attachment; filename=pharmacists_${page}_${limit}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();
    } catch (e) {
        next(e);
    }
};

export default exportPharmacistsAsExcel;
