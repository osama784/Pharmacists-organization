import IInvoiceQueries from "../../../types/queries/invoice.query.js";
import { buildDateFilter, buildNumberFilter, buildStringFilter } from "../../../utils/buildFilters.js";

const buildInvoiceFilters = (queries: IInvoiceQueries): Record<string, any> => {
    let filters: Record<string, any> = {};
    if (queries.total) filters.total = buildNumberFilter(queries.total);
    if (queries.status) filters.status = buildStringFilter(queries.status);
    if (queries.paidDate) filters.paidDate = buildDateFilter(queries.paidDate);
    if (queries.createdAt) filters.createdAt = buildDateFilter(queries.createdAt);

    Object.keys(filters).forEach((key) => {
        if (filters[key] == undefined) {
            delete filters[key];
        }
    });
    return filters;
};

export default buildInvoiceFilters;
