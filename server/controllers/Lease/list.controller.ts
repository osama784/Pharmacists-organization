import { NextFunction, Request, TypedResponse } from "express";
import { LeaseResponseDto, toLeaseResponseDto } from "../../types/dtos/lease.dto";
import Lease from "../../models/lease.model";
import { ILeaseQuery } from "../../types/queries/lease.query";
import buildLeaseFilters from "./utils/buildLeaseFilters";

const listLeases = async (req: Request, res: TypedResponse<LeaseResponseDto[]>, next: NextFunction) => {
    try {
        const queries = req.query as ILeaseQuery;
        const page = parseInt(queries.page!) || 0;
        const limit = parseInt(queries.limit!) || 10;
        const skip = page * limit;

        const filters = await buildLeaseFilters(queries);
        const leases = await Lease.find(filters).sort("-updatedAt").skip(skip).limit(limit);

        const totalItems = await Lease.countDocuments(filters);
        res.json({
            success: true,
            data: toLeaseResponseDto(leases),
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

export default listLeases;
