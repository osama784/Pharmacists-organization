import Section from "../../../models/section.model";
import ITreasuryFeeQuery from "../../../types/queries/treasuryFee.query";
import { buildNumberFilter, buildStringFilter } from "../../../utils/buildFilters";

const buildTreasuryFeeFilters = async (queries: ITreasuryFeeQuery) => {
    let filters: Record<string, any> = {};

    if (queries.name) filters.name = buildStringFilter(queries.name);
    if (queries.value) filters.value = buildNumberFilter(queries.value);
    if (queries.associatedParty) filters.associatedParty = buildStringFilter(queries.associatedParty);
    if (queries.receiptBook) filters.receiptBook = buildStringFilter(queries.receiptBook);

    Object.keys(filters).forEach((key) => {
        if (filters[key] == undefined) {
            delete filters[key];
        }
    });

    if (queries.associatedSection) {
        const sectionFilter = buildStringFilter(queries.associatedSection);
        if (sectionFilter != undefined) {
            const sections = await Section.find({ name: sectionFilter });
            filters = { ...filters, pharmacist: { $in: sections } };
        }
    }
    return filters;
};

export default buildTreasuryFeeFilters;
