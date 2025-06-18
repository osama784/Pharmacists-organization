import Fee from "../../src/models/Fee.js";
import Section from "../../src/models/Section.js";
import loadJSONFile from "./loadJsonFile.js";
const sections = await loadJSONFile("../data/sections.json");

export const assignFeesToSections = async () => {
    // const syndicateSectionID = "683ed7fcd8be3402ffb2f839";
    // const RetirementSectionID = "683ed7fcd8be3402ffb2f83a";
    // const disabiltiySectionID = "683ed7fcd8be3402ffb2f83b";
    // const healthSectionID = "683ed7fcd8be3402ffb2f83c";
    const syndicateSectionID = "68455a82dd77a9fedcbdbfb1";
    const RetirementSectionID = "68455a82dd77a9fedcbdbfb2";
    const disabiltiySectionID = "68455a82dd77a9fedcbdbfb3";
    const healthSectionID = "68455a82dd77a9fedcbdbfb4";

    const _syndicateFees = await Fee.find({ section: syndicateSectionID });
    const syndicateFees = _syndicateFees.map((fee) => fee._id);
    const syndicateSectionDoc = await Section.findOneAndUpdate(
        { _id: syndicateSectionID },
        {
            fees: syndicateFees,
        }
    );

    const _retirementFees = await Fee.find({ section: RetirementSectionID });
    const retirementFees = _retirementFees.map((fee) => fee._id);
    const RetirementSectionDoc = await Section.findOneAndUpdate(
        { _id: RetirementSectionID },
        {
            fees: retirementFees,
        }
    );
    const _disabiltiyFees = await Fee.find({ section: disabiltiySectionID });
    const disabiltiyFees = _disabiltiyFees.map((fee) => fee._id);
    const disabiltiySectionDoc = await Section.findOneAndUpdate(
        { _id: disabiltiySectionID },
        {
            fees: disabiltiyFees,
        }
    );
    const _healthFees = await Fee.find({ section: healthSectionID });
    const healthFees = _healthFees.map((fee) => fee._id);
    const healthSectionDoc = await Section.findOneAndUpdate(
        { _id: healthSectionID },
        {
            fees: healthFees,
        }
    );
    await sections.forEach(async (section) => {
        const fees = section.fineableFees.map(async (fee) => {
            const doc = await Fee.findOne({ name: fee });
            if (!doc) {
                throw new Error(`fee with name ${fee} not found`);
            }
            return doc._id;
        });
        const fineSummaryFee = await Fee.findOne({ name: section.fineSummaryFee });
        if (!fineSummaryFee) {
            throw new Error(`fine summary fee with name ${section.fineSummaryFee} not found`);
        }

        const feeIds = await Promise.all(fees);
        const doc = await Section.findOneAndUpdate(
            { name: section.name },
            {
                fineableFees: feeIds,
                fineSummaryFee: fineSummaryFee._id,
            },
            { new: true }
        );
        console.log(doc);
    });
};
