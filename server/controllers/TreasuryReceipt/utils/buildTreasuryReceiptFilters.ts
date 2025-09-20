import Pharmacist from "../../../models/pharmacist.model";
import { ITreasuryReceiptQuery } from "../../../types/queries/treasuryReceipt.query";
import { buildDateFilter, buildNumberFilter, buildStringFilter } from "../../../utils/buildFilters";
import buildPharmacistFilters from "../../Pharmacist/utils/buildPharmacistFilters";

const buildTreasuryReceiptFilters = async (queries: ITreasuryReceiptQuery) => {
    let filters: Record<string, any> = {};
    if (queries.id) filters.serialID = buildStringFilter(queries.id);
    if (queries.receiptBook) filters.receiptBook = buildStringFilter(queries.receiptBook);
    if (queries.total) filters.total = buildNumberFilter(queries.total);
    if (queries.createdAt) filters.createdAt = buildDateFilter(queries.createdAt);

    if (queries.pharmacist) {
        const pharmacistsFilter = buildPharmacistFilters(queries.pharmacist);
        if (Object.keys(pharmacistsFilter).length != 0) {
            const pharmacists = await Pharmacist.find(pharmacistsFilter);
            filters = { ...filters, pharmacist: { $in: pharmacists } };
        }
    }

    return filters;
};

export default buildTreasuryReceiptFilters;
