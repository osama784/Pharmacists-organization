import { IRoleQueries } from "../../../types/queries/role.query.js";
import { buildStringFilter } from "../../../utils/buildFilters.js";

const buildRoleFilters = (queries: IRoleQueries) => {
    let filters: Record<string, any> = {};
    if (queries.name) filters.name = buildStringFilter(queries.name);
    Object.keys(filters).forEach((key) => {
        if (filters[key] == undefined) {
            delete filters[key];
        }
    });
    return filters;
};

export default buildRoleFilters;
