import Role from "../../../models/role.model.js";
import { IUserQuery } from "../../../types/queries/user.query.js";
import { buildStringFilter } from "../../../utils/buildFilters.js";

const buildUserFilters = async (queries: IUserQuery) => {
    let filters: Record<string, any> = {};
    if (queries.username) filters.username = buildStringFilter(queries.username);
    if (queries.email) filters.email = buildStringFilter(queries.email);
    if (queries.status) filters.status = buildStringFilter(queries.status);
    if (queries.phoneNumber) filters.phoneNumber = buildStringFilter(queries.phoneNumber);
    if (queries.role) filters.role = buildStringFilter(queries.role);
    Object.keys(filters).forEach((key) => {
        if (filters[key] == undefined) {
            delete filters[key];
        }
    });
    // change role name to role id
    if (filters.role) {
        const roles = await Role.find({ name: filters.role });

        if (roles) {
            filters.role = { $in: roles };
        }
    }
    return filters;
};

export default buildUserFilters;
