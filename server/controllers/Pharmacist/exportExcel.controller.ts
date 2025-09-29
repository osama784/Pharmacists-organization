import pharmacistSchema from "../../models/pharmacist.model.js";
import ExcelJS from "exceljs";
import { PharmacistModelTR } from "../../translation/models.ar.js";
import { NextFunction, Request, text, TypedResponse } from "express";
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

        const result = await pharmacistSchema
            .find(filters)
            .select("-invoices -licenses -universityDegrees -penalties -syndicateRecords")
            .skip(skip)
            .limit(limit);
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Data Export");
        const excludedFields = [
            "invoices",
            "licenses",
            "universityDegrees",
            "penalties",
            "syndicateRecords",
            "__v",
            "_id",
            "fullName",
            "currentSyndicate",
            "folderToken",
            "images",
            "practiceState",
            "syndicateMembershipStatus",
            "currentSyndicate",
            "createdAt",
            "updatedAt",
        ];

        const headers = Object.keys(pharmacistSchema.schema.paths).filter((key) => {
            if (key.includes("currentSyndicate")) return false;
            return !excludedFields.includes(key);
        });
        worksheet.columns = headers
            .map((header) => ({
                header: PharmacistModelTR[header as keyof Omit<IPharmacist, "invoices" | "currentSyndicate">],
                key: header,
                width: 25,
            }))
            .concat([
                {
                    header: "رابط الصور",
                    key: "imagesURL",
                    width: 40,
                },
            ]);

        result.forEach((doc) => {
            worksheet.addRow({
                ...doc.toJSON(),
                imagesURL: {
                    text: "click for download",
                    hyperlink: `${req.protocol}://${req.get("host")}/api/pharmacists/download/${doc.id}/${doc.folderToken}`,
                },
            });
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
