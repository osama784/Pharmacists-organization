import Pharmacist from "../../../models/pharmacist.model";
import { ILeaseQuery, LeaseQueries } from "../../../types/queries/lease.query";
import IPharmacistQueries from "../../../types/queries/pharmacist.query";
import { buildFilter } from "../../../utils/buildFilters";
import buildPharmacistFilters from "../../Pharmacist/utils/buildPharmacistFilters";

const buildLeaseFilters = async (queries: ILeaseQuery) => {
    let filters: Record<string, any> = {};
    const entries = Object.entries(queries) as [keyof ILeaseQuery, any][];
    for (const entry of entries) {
        filters[entry[0]] = buildFilter(entry[1], LeaseQueries[entry[0]]);
    }

    Object.keys(filters).forEach((key) => {
        if (filters[key] == undefined) {
            delete filters[key];
        }
    });

    if (queries.pharmacistOwner) {
        const pharmacistOwnerFilter = buildPharmacistFilters(queries.pharmacistOwner as IPharmacistQueries);
        if (Object.keys(pharmacistOwnerFilter).length != 0) {
            const pharmacists = await Pharmacist.find(pharmacistOwnerFilter);
            filters = { ...filters, pharmacistOwner: { $in: pharmacists } };
        }
    }

    return filters;
};

export default buildLeaseFilters;
