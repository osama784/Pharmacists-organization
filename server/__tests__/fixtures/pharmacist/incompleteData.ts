import { GenderEnum } from "../../../models/pharmacist.model";

const date = new Date();

/**
 * missing 5 required fields: firstName, lastName, fatherName, motherName, gender
 * => 5 errors
 */
export const missingRequiredFields = {
    birthDate: "1985",
    nationality: "سوري",
    nationalNumber: "232132",
    phoneNumber: "09932132",
    graduationYear: "2015",

    registrationNumber: "231312",
    registrationDate: date.toString(),
};

export const missingOptionalFields = {
    firstName: "osama",
    lastName: "doage",
    fatherName: "mazen",
    motherName: "wafaa",

    birthDate: "1985",
    nationality: "سوري",
    nationalNumber: "232132",
    phoneNumber: "09932132",
    gender: GenderEnum.MALE,
    graduationYear: date.toString(),

    registrationNumber: "231312",
    registrationDate: date.toString(),
};
