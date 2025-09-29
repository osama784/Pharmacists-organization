export default interface IPharmacistQueries {
    page?: string;
    limit?: string;
    firstName?: string | Object;
    lastName?: string | Object;
    fatherName?: string | Object;
    motherName?: string | Object;

    fullName?: string | Object;

    firstNameEnglish?: string | Object;
    lastNameEnglish?: string | Object;
    fatherNameEnglish?: string | Object;
    motherNameEnglish?: string | Object;

    gender?: string;
    nationalNumber?: string | Object;
    birthDate?: string | Object;
    birthPlace?: string | Object;
    phoneNumber?: string | Object;
    landlineNumber?: string | Object;
    address?: string | Object;
    graduationYear?: string | Object;
    lastTimePaid?: string | Object;
    nationality?: string | Object;
    ministerialNumber?: string | Object;
    ministerialRegistrationDate?: string | Object;
    registrationNumber?: string | Object;
    registrationDate?: string | Object;

    integrity?: string | Object;
    register?: string | Object;
    oathTakingDate?: string | Object;
    deathDate?: string | null;
    retirementDate?: string | null;

    syndicateMembershipStatus?: string | Object;
    practiceState?: string | Object;
    currentSyndicate?: string | Object;
}
