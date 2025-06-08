import { AnyBulkWriteOperation, Schema } from "mongoose";
import feesSyndicate from "../data/fees_syndicate_account.json";
import feesRetirement from "../data/fees_retirement_treasury_account.json";
import feesDisabiltiy from "../data/fees_Disability_and_Death_Benefit_Fund_Account.json";
import feesHealth from "../data/fees_Health_Takaful_Account.json";
import Fee from "../../src/models/Fee";

export const createFees = async () => {
    const syndicateSectionID = "683ed7fcd8be3402ffb2f839";
    const RetirementSectionID = "683ed7fcd8be3402ffb2f83a";
    const disabiltiySectionID = "683ed7fcd8be3402ffb2f83b";
    const healthSectionID = "683ed7fcd8be3402ffb2f83c";

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
    try {
        let result = await Fee.bulkWrite(objects);
        console.log(result);
    } catch (e) {
        console.log(e);
    }
};
