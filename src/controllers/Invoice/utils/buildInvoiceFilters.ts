import IInvoiceQueries from "../../../types/queries/invoice.query.js";
import { buildBooleanFilter, buildDateFilter, buildNumberFilter, buildStringFilter } from "../../../utils/buildFilters.js";
import buildPharmacistFilters from "../../Pharmacist/utils/buildPharmacistFilters.js";
import Pharmacist from "../../../models/pharmacist.model.js";

const buildInvoiceFilters = async (queries: IInvoiceQueries): Promise<Record<string, any>> => {
    let filters: Record<string, any> = {};
    if (queries.id) filters._id = buildStringFilter(queries.id);
    if (queries.total) filters.total = buildNumberFilter(queries.total);
    if (queries.status) filters.status = buildStringFilter(queries.status);
    if (queries.syndicateMembership) filters.syndicateMembership = buildStringFilter(queries.syndicateMembership);
    if (queries.paidDate) filters.paidDate = buildDateFilter(queries.paidDate);
    if (queries.createdAt) filters.createdAt = buildDateFilter(queries.createdAt);
    if (queries.isFinesIncluded) filters.isFinesIncluded = buildBooleanFilter(queries.isFinesIncluded);

    Object.keys(filters).forEach((key) => {
        if (filters[key] == undefined) {
            delete filters[key];
        }
    });
    if (queries.pharmacist) {
        const pharmacistsFilter = buildPharmacistFilters(queries.pharmacist);
        console.log(pharmacistsFilter);
        if (Object.keys(pharmacistsFilter).length != 0) {
            const pharmacists = await Pharmacist.find(pharmacistsFilter);
            filters = { ...filters, pharmacist: { $in: pharmacists } };
        }
    }
    return filters;
};

export default buildInvoiceFilters;
