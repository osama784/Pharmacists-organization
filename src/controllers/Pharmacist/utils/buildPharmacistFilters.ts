import IPharmacistQueries from "../../../types/queries/pharmacist.query.js";
import { buildDateFilter, buildNumberFilter, buildStringFilter } from "../../../utils/buildFilters.js";

const buildPharmacistFilters = (queries: IPharmacistQueries): Record<string, any> => {
    let filters: Record<string, any> = {};
    if (queries.fisrtName) filters.fisrtName = buildStringFilter(queries.fisrtName);
    if (queries.lastName) filters.lastName = buildStringFilter(queries.lastName);
    if (queries.fatherName) filters.fatherName = buildStringFilter(queries.fatherName);
    if (queries.motherName) filters.motherName = buildStringFilter(queries.motherName);
    if (queries.fullName) filters.fullName = buildStringFilter(queries.fullName);
    if (queries.firstNameEnglish) filters.firstNameEnglish = buildStringFilter(queries.firstNameEnglish);
    if (queries.lastNameEnglish) filters.lastNameEnglish = buildStringFilter(queries.lastNameEnglish);
    if (queries.fatherNameEnglish) filters.fatherNameEnglish = buildStringFilter(queries.fatherNameEnglish);
    if (queries.motherNameEnglish) filters.motherNameEnglish = buildStringFilter(queries.motherNameEnglish);
    if (queries.gender) filters.gender = buildStringFilter(queries.gender);
    if (queries.nationalNumber) filters.nationalNumber = buildNumberFilter(queries.nationalNumber);
    if (queries.birthDate) filters.birthDate = buildDateFilter(queries.birthDate);
    if (queries.birthPlace) filters.birthPlace = buildStringFilter(queries.birthPlace);
    if (queries.phoneNumber) filters.phoneNumber = buildStringFilter(queries.phoneNumber);
    if (queries.landlineNumber) filters.landlineNumber = buildNumberFilter(queries.landlineNumber);
    if (queries.address) filters.address = buildStringFilter(queries.address);
    if (queries.graduationYear) filters.graduationYear = buildNumberFilter(queries.graduationYear);
    if (queries.lastTimePaid) filters.lastTimePaid = buildDateFilter(queries.lastTimePaid);
    if (queries.nationality) filters.nationality = buildStringFilter(queries.nationality);

    if (queries.ministerialNumber) filters.ministerialNumber = buildNumberFilter(queries.ministerialNumber);
    if (queries.ministerialRegistrationDate) filters.ministerialRegistrationDate = buildDateFilter(queries.ministerialRegistrationDate);
    if (queries.registrationNumber) filters.registrationNumber = buildNumberFilter(queries.registrationNumber);
    if (queries.registrationDate) filters.registrationDate = buildDateFilter(queries.registrationDate);

    if (queries.integrity) filters.integrity = buildStringFilter(queries.integrity);
    if (queries.register) filters.register = buildStringFilter(queries.register);
    if (queries.oathTakingDate) filters.oathTakingDate = buildDateFilter(queries.oathTakingDate);

    if (queries.syndicateMembershipStatus) filters.syndicateMembershipStatus = buildStringFilter(queries.syndicateMembershipStatus);
    if (queries.currentSyndicate) filters["currentSyndicate.syndicate"] = buildStringFilter(queries.currentSyndicate);
    if (queries.practiceState) filters.practiceState = buildStringFilter(queries.practiceState);

    Object.keys(filters).forEach((key) => {
        if (filters[key] == undefined) {
            delete filters[key];
        }
    });
    return filters;
};

export default buildPharmacistFilters;
