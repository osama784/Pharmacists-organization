import User from "../../models/user.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { IUserQuery } from "../../types/queries/user.query.js";
import buildUserFilters from "./utils/buildUserFilters.js";
import { RoleDocument } from "../../types/models/role.types.js";
import { toUserResponseDto, UserResponseDto } from "../../types/dtos/user.dto.js";

const listUsers = async (req: Request, res: TypedResponse<UserResponseDto[]>, next: NextFunction) => {
    try {
        const queries = req.query as IUserQuery;
        const page = parseInt(queries.page!) || 0;
        const limit = parseInt(queries.limit!) || 10;
        const skip = page * limit;
        const filters = await buildUserFilters(queries);
        const result = await User.find(filters).sort("-createdAt").skip(skip).limit(limit).populate<{ role: RoleDocument }>("role");

        const totalItems = await User.find(filters).countDocuments();

        res.json({
            success: true,
            data: toUserResponseDto(result),
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

export default listUsers;
