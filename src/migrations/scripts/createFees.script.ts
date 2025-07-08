import feesSyndicate from "../data/fees_syndicate_account.json";
import feesRetirement from "../data/fees_retirement_treasury_account.json";
import feesDisabiltiy from "../data/fees_Disability_and_Death_Benefit_Fund_Account.json";
import feesHealth from "../data/fees_Health_Takaful_Account.json";
import Fee from "../../models/fee.model";
import Section from "../../models/section.model";
import { AnyBulkWriteOperation } from "mongoose";

export const createFees = async () => {
    // const syndicateSectionID = "683ed7fcd8be3402ffb2f839";
    // const RetirementSectionID = "683ed7fcd8be3402ffb2f83a";
    // const disabiltiySectionID = "683ed7fcd8be3402ffb2f83b";
    // const healthSectionID = "683ed7fcd8be3402ffb2f83c";
    // const syndicateSectionID = "68455a82dd77a9fedcbdbfb1";
    // const RetirementSectionID = "68455a82dd77a9fedcbdbfb2";
    // const disabiltiySectionID = "68455a82dd77a9fedcbdbfb3";
    // const healthSectionID = "68455a82dd77a9fedcbdbfb4";

    const syndicateSectionDoc = await Section.findOne({ name: "حساب نقابة صيادلة سورية رقم 209999 جاري" });
    const RetirementSectionDoc = await Section.findOne({ name: "حساب خزانة تقاعد صيادلة سورية رقم 203333 جاري" });
    const disabiltiySectionDoc = await Section.findOne({ name: "حساب صندوق إعانة العجز و الوفاة لصيادلة سورية رقم 2077777 جاري" });
    const healthSectionDoc = await Section.findOne({ name: "حساب التكافل الصحي لصيادلة سورية رقم 205550 جاري" });
    if (!syndicateSectionDoc || !RetirementSectionDoc || !disabiltiySectionDoc || !healthSectionDoc) {
        throw new Error("some sections are missing");
    }

    let objects: any[] = [];
    feesSyndicate.forEach((feeObject) => {
        objects.push({
            insertOne: {
                document: { ...feeObject, section: syndicateSectionDoc },
            },
        });
    });
    feesRetirement.forEach((feeObject) => {
        objects.push({
            insertOne: {
                document: { ...feeObject, section: RetirementSectionDoc },
            },
        });
    });
    feesDisabiltiy.forEach((feeObject) => {
        objects.push({
            insertOne: {
                document: { ...feeObject, section: disabiltiySectionDoc },
            },
        });
    });
    feesHealth.forEach((feeObject) => {
        objects.push({
            insertOne: {
                document: { ...feeObject, section: healthSectionDoc },
            },
        });
    });
    let result = await Fee.bulkWrite(objects);
    console.log(result);
};
