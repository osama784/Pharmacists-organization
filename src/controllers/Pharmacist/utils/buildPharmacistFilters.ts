import IPharmacistQueries from "../../../types/queries/pharmacist.query.js";
import { buildDateFilter, buildNumberFilter, buildStringFilter } from "../../../utils/buildFilters.js";

const buildPharmacistFilters = (queries: IPharmacistQueries): Record<string, any> => {
    let filters: Record<string, any> = {};
    if (queries.fisrtName) filters.fisrtName = buildStringFilter(queries.fisrtName);
    if (queries.lastName) filters.lastName = buildStringFilter(queries.lastName);
    if (queries.address) filters.address = buildStringFilter(queries.address);
    if (queries.birthPlace) filters.birthPlace = buildStringFilter(queries.birthPlace);
    if (queries.fatherName) filters.fatherName = buildStringFilter(queries.fatherName);
    if (queries.motherName) filters.motherName = buildStringFilter(queries.motherName);
    if (queries.gender) filters.gender = buildStringFilter(queries.gender);
    if (queries.nationality) filters.nationality = buildStringFilter(queries.nationality);
    if (queries.phoneNumber) filters.phoneNumber = buildStringFilter(queries.phoneNumber);
    if (queries.graduationYear) filters.graduationYear = buildNumberFilter(queries.graduationYear);
    if (queries.birthDate) filters.birthDate = buildDateFilter(queries.birthDate);
    if (queries.registrationDate) filters.registrationDate = buildDateFilter(queries.registrationDate);
    if (queries.ministerialRegistrationDate) filters.ministerialRegistrationDate = buildDateFilter(queries.ministerialRegistrationDate);

    Object.keys(filters).forEach((key) => {
        if (filters[key] == undefined) {
            delete filters[key];
        }
    });
    return filters;
};

export default buildPharmacistFilters;
