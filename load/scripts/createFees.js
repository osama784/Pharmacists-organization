import loadJsonFile from "./loadJsonFile.js";
const feesSyndicate = await loadJsonFile("../data/fees_syndicate_account.json");
const feesRetirement = await loadJsonFile("../data/fees_retirement_treasury_account.json");
const feesDisabiltiy = await loadJsonFile("../data/fees_Disability_and_Death_Benefit_Fund_Account.json");
const feesHealth = await loadJsonFile("../data/fees_Health_Takaful_Account.json");
import Fee from "../../src/models/Fee.js";
import Section from "../../src/models/Section.js";

export const createFees = async () => {
    // const syndicateSectionID = "683ed7fcd8be3402ffb2f839";
    // const RetirementSectionID = "683ed7fcd8be3402ffb2f83a";
    // const disabiltiySectionID = "683ed7fcd8be3402ffb2f83b";
    // const healthSectionID = "683ed7fcd8be3402ffb2f83c";
    const syndicateSectionID = "68455a82dd77a9fedcbdbfb1";
    const RetirementSectionID = "68455a82dd77a9fedcbdbfb2";
    const disabiltiySectionID = "68455a82dd77a9fedcbdbfb3";
    const healthSectionID = "68455a82dd77a9fedcbdbfb4";

    let objects = [];
    feesSyndicate.forEach((feeObject) => {
        objects.push({
            insertOne: {
                document: { ...feeObject, section: syndicateSectionID },
            },
        });
    });
    feesRetirement.forEach((feeObject) => {
        objects.push({
            insertOne: {
                document: { ...feeObject, section: RetirementSectionID },
            },
        });
    });
    feesDisabiltiy.forEach((feeObject) => {
        objects.push({
            insertOne: {
                document: { ...feeObject, section: disabiltiySectionID },
            },
        });
    });
    feesHealth.forEach((feeObject) => {
        objects.push({
            insertOne: {
                document: { ...feeObject, section: healthSectionID },
            },
        });
    });
    let result = await Fee.bulkWrite(objects);
    console.log(result);
};
