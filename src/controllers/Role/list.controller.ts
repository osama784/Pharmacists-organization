import Role from "../../models/role.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { RoleDocument } from "../../types/models/role.types.js";
import { IRoleQueries } from "../../types/queries/role.query.js";
import buildRoleFilters from "./utils/buildRoleFilters.js";

const listRoles = async (req: Request, res: TypedResponse<RoleDocument[]>, next: NextFunction) => {
    try {
        const queries = req.query as IRoleQueries;
        const page = parseInt(queries.page!) || 1;
        const limit = parseInt(queries.limit!) || 10;
        const skip = (page - 1) * limit;
        const filters = buildRoleFilters(queries);

        const roles = await Role.find(filters).skip(skip).limit(limit);
        const totalItems = await Role.find(filters).countDocuments();

        res.json({
            success: true,
            data: roles,
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
