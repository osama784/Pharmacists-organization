import Role from "../../models/role.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { IRoleQueries } from "../../types/queries/role.query.js";
import buildRoleFilters from "./utils/buildRoleFilters.js";
import { RoleResponseDto, toRoleResponseDto } from "../../types/dtos/role.dto.js";

const listRoles = async (req: Request, res: TypedResponse<RoleResponseDto[]>, next: NextFunction) => {
    try {
        const queries = req.query as IRoleQueries;
        const page = parseInt(queries.page!) || 0;
        const limit = parseInt(queries.limit!) || 10;
        const skip = page * limit;
        const filters = buildRoleFilters(queries);

        const roles = await Role.find(filters).sort("-createdAt").skip(skip).limit(limit);
        const totalItems = await Role.find(filters).countDocuments();

        res.json({
            success: true,
            data: toRoleResponseDto(roles),
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

export default listRoles;
