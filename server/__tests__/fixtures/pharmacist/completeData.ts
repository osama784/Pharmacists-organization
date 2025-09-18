import { GenderEnum } from "../../../models/pharmacist.model";
import { CreatePharmacistDto } from "../../../types/dtos/pharmacist.dto";

const date = new Date();

export const CompleteData: CreatePharmacistDto = {
    firstName: "osama",
    lastName: "doage",
    fatherName: "mazen",
    motherName: "wafaa",

    firstNameEnglish: "osamaEnglish",
    lastNameEnglish: "doageEnglish",
    fatherNameEnglish: "mazenEnglish",
    motherNameEnglish: "wafaaEnglish",

    address: "Darya",
    birthDate: "1985",
    birthPlace: "Darya",
    nationality: "سوري",
    nationalNumber: "232132",
    phoneNumber: "09932132",
    gender: GenderEnum.MALE,
    graduationYear: date.toString(),
    landlineNumber: "6291951",

    registrationNumber: "231312",
    registrationDate: date.toString(),
    ministerialNumber: "998222",
    ministerialRegistrationDate: date.toString(),
    integrity: "integrity",
    register: "register",
    oathTakingDate: date.toString(),
};

export const RequiredData = {
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

export const OptionalData = {
    firstNameEnglish: "osamaEnglish",
    lastNameEnglish: "doageEnglish",
    fatherNameEnglish: "mazenEnglish",
    motherNameEnglish: "wafaaEnglish",

    address: "Darya",
    birthPlace: "Darya",
    landlineNumber: "6291951",

    ministerialNumber: "998222",
    ministerialRegistrationDate: date.toString(),
    integrity: "integrity",
    register: "register",
    oathTakingDate: date.toString(),
};
