import User from "../../models/user.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { IUserQuery } from "../../types/queries/user.query.js";
import buildUserFilters from "./utils/buildUserFilters.js";
import { RoleDocument } from "../../types/models/role.types.js";
import { PopulatedUserDocument } from "../../types/models/user.types.js";

const listUsers = async (req: Request, res: TypedResponse<PopulatedUserDocument[]>, next: NextFunction) => {
    try {
        const queries = req.query as IUserQuery;
        const page = parseInt(queries.page!) || 1;
        const limit = parseInt(queries.limit!) || 10;
        const skip = (page - 1) * limit;
        const filters = await buildUserFilters(queries);
        const _result = await User.find(filters).sort("-createdAt").skip(skip).limit(limit).populate<{ role: RoleDocument }>("role");
        const result: any[] = [];
        for (const user of _result) {
            let newUser: any = user.toJSON();
            delete newUser._id;
            delete newUser.__v;
            delete newUser.role;

            result.push({
                id: user._id,
                role: user.role.name,
                ...newUser,
            });
        }
        const totalItems = await User.find(filters).countDocuments();

        res.json({
            success: true,
            data: result,
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
