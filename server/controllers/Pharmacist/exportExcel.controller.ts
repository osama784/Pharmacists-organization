import Pharmacist from "../../models/pharmacist.model.js";
import ExcelJS from "exceljs";
import { PharmacistModelTR } from "../../translation/models.ar.js";
import { NextFunction, Request, TypedResponse } from "express";
import IPharmacistQueries from "../../types/queries/pharmacist.query.js";
import buildPharmacistFilters from "./utils/buildPharmacistFilters.js";
import { IPharmacist } from "../../types/models/pharmacist.types.js";

const exportPharmacistsAsExcel = async (req: Request, res: TypedResponse<null>, next: NextFunction) => {
    try {
        const queries = req.query as IPharmacistQueries;
        const page = parseInt(queries.page!) || 0;
        const limit = parseInt(queries.limit!) || 10;
        const skip = page * limit;
        const filters = buildPharmacistFilters(queries);

        const result = await Pharmacist.find(filters)
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
            header: PharmacistModelTR[header as keyof Omit<IPharmacist, "invoices" | "currentSyndicate">],
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
