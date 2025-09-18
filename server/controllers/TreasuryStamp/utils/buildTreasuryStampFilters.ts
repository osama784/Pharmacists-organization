import { ITreasuryStampQuery } from "../../../types/queries/treasuryStamp.query";
import { buildDateFilter, buildNumberFilter, buildStringFilter } from "../../../utils/buildFilters";

const buildTreasuryStampFilters = (queries: ITreasuryStampQuery) => {
    let filters: Record<string, any> = {};
    if (queries.id) filters.serialID = buildStringFilter(queries.id);
    if (queries.name) filters.name = buildStringFilter(queries.name);
    if (queries.value) filters.value = buildNumberFilter(queries.value);
    if (queries.initialQuantity) filters.initialQuantity = buildStringFilter(queries.initialQuantity);
    if (queries.soldQuantity) filters.soldQuantity = buildStringFilter(queries.soldQuantity);
    if (queries.createdAt) filters.createdAt = buildDateFilter(queries.createdAt);

    return filters;
};

export default buildTreasuryStampFilters;
