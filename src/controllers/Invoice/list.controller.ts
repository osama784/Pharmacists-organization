import Invoice from "../../models/invoice.model.js";
import { PharmacistDocument } from "../../types/models/pharmacist.types.js";
import IInvoiceQueries from "../../types/queries/invoice.query.js";
import { NextFunction, Request, TypedResponse } from "express";
import buildInvoiceFilters from "./utils/buildInvoiceFilters.js";
import { InvoiceResponseDto, toInvoiceResponseDto } from "../../types/dtos/invoice.dto.js";

const listInvoices = async (req: Request, res: TypedResponse<InvoiceResponseDto[]>, next: NextFunction) => {
    try {
        const queries = req.query as IInvoiceQueries;
        const page = parseInt(queries.page!) || 0;
        const limit = parseInt(queries.limit!) || 10;
        const skip = page * limit;
        const filters = await buildInvoiceFilters(queries);

        const result = await Invoice.find(filters).select("-fees").sort("-updatedAt").skip(skip).limit(limit).populate<{
            pharmacist: PharmacistDocument;
        }>("pharmacist");

        const totalItems = await Invoice.find(filters).countDocuments();

        res.json({
            success: true,
            data: toInvoiceResponseDto(result),
            meta: {
                totalItems: totalItems,
                currentPage: page,
                totalPages: Math.ceil(totalItems / limit),
                itemsPerPage: limit,
            },
        });
    } catch (e) {
        next(e);
    }
};

export default listInvoices;
