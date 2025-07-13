import Pharmacist from "../../models/pharmacist.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import IPharmacistQueries from "../../types/queries/pharmacist.query.js";
import buildPharmacistFilters from "./utils/buildPharmacistFilters.js";
import { PharmacistResponseDto, toPharmacistResponseDto } from "../../types/dtos/pharmacist.dto.js";

const listPharmacists = async (req: Request, res: TypedResponse<PharmacistResponseDto[]>, next: NextFunction) => {
    try {
        const queries = req.query as IPharmacistQueries;
        const page = parseInt(queries.page!) || 1;
        const limit = parseInt(queries.limit!) || 10;
        const skip = (page - 1) * limit;
        const filters = buildPharmacistFilters(queries);
        const result = await Pharmacist.find(filters).sort("-createdAt").skip(skip).limit(limit);

        const totalItems = await Pharmacist.find(filters).countDocuments();

        res.json({
            success: true,
            data: toPharmacistResponseDto(result),
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

export default listPharmacists;
