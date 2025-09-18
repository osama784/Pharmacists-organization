import { ITreasuryExpenditureQuery } from "../../../types/queries/treasuryExpenditure.query";
import { buildDateFilter, buildNumberFilter, buildStringFilter } from "../../../utils/buildFilters";

const buildTreasuryExpenditureFilters = (queries: ITreasuryExpenditureQuery) => {
    let filters: Record<string, any> = {};
    if (queries.id) filters.serialID = buildStringFilter(queries.id);
    if (queries.name) filters.name = buildStringFilter(queries.name);
    if (queries.value) filters.value = buildNumberFilter(queries.value);
    if (queries.associatedSection) filters.associatedSection = buildStringFilter(queries.associatedSection);
    if (queries.createdAt) filters.createdAt = buildDateFilter(queries.createdAt);

    return filters;
};

export default buildTreasuryExpenditureFilters;
