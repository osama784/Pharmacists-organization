import IBankQuery from "../../../types/queries/bank.query";
import { buildStringFilter } from "../../../utils/buildFilters";

const buildBankFilters = (queries: IBankQuery): Record<string, any> => {
    let filters: Record<string, any> = {};
    if (queries.name) filters.name = buildStringFilter(queries.name);

    Object.keys(filters).forEach((key) => {
        if (filters[key] == undefined) {
            delete filters[key];
        }
    });

    return filters;
};

export default buildBankFilters;
