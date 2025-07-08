import { IUserQuery } from "../../../types/queries/user.query.js";
import { buildStringFilter } from "../../../utils/buildFilters.js";

const buildUserFilters = (queries: IUserQuery) => {
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
    return filters;
};

export default buildUserFilters;
