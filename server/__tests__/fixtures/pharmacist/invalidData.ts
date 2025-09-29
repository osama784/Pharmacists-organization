import { createPharmacistData } from "./factory";

const date = new Date();

/**
 * 14 string fields, input as number
 * => 14 errors
 */
export const invalidStringFields = createPharmacistData({
    firstName: 111,
    lastName: 111,
    fatherName: 111,
    motherName: 111,

    firstNameEnglish: 111,
    lastNameEnglish: 111,
    fatherNameEnglish: 111,
    motherNameEnglish: 111,

    address: 111,
    birthPlace: 111,
    nationality: 111,
    phoneNumber: 111,
    integrity: 111,
    register: 111,
});

/**
 * 6 date fields, input as string
 * => 6 errors
 */
export const invalidDateFields = createPharmacistData({
    birthDate: "invalid-Date",
    graduationYear: "invalid-Date",
    lastTimePaid: "invalid-Date",
    registrationDate: "invalid-Date",
    ministerialRegistrationDate: "invalid-Date",
    oathTakingDate: "invalid-Date",
});

/**
 * 1 enum value, input as normal string,
 * => 1 error
 */
export const invalidEnumFields = createPharmacistData({
    gender: "invalid-Enum",
});
