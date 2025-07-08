import Fee from "../../models/fee.model";
import Section from "../../models/section.model";
import sections from "../data/sections.json";

export const assignFeesToSections = async () => {
    const syndicateSectionDoc = await Section.findOne({ name: "حساب نقابة صيادلة سورية رقم 209999 جاري" });
    const RetirementSectionDoc = await Section.findOne({ name: "حساب خزانة تقاعد صيادلة سورية رقم 203333 جاري" });
    const disabiltiySectionDoc = await Section.findOne({ name: "حساب صندوق إعانة العجز و الوفاة لصيادلة سورية رقم 2077777 جاري" });
    const healthSectionDoc = await Section.findOne({ name: "حساب التكافل الصحي لصيادلة سورية رقم 205550 جاري" });
    if (!syndicateSectionDoc || !RetirementSectionDoc || !disabiltiySectionDoc || !healthSectionDoc) {
        throw new Error("some sections are missing");
    }

    const _syndicateFees = await Fee.find({ section: syndicateSectionDoc._id });
    const syndicateFees = _syndicateFees.map((fee) => fee._id);
    await syndicateSectionDoc.updateOne({
        fees: syndicateFees,
    });

    const _retirementFees = await Fee.find({ section: RetirementSectionDoc._id });
    const retirementFees = _retirementFees.map((fee) => fee._id);
    await RetirementSectionDoc.updateOne({
        fees: retirementFees,
    });
    const _disabiltiyFees = await Fee.find({ section: disabiltiySectionDoc._id });
    const disabiltiyFees = _disabiltiyFees.map((fee) => fee._id);
    await disabiltiySectionDoc.updateOne({
        fees: disabiltiyFees,
    });
    const _healthFees = await Fee.find({ section: healthSectionDoc._id });
    const healthFees = _healthFees.map((fee) => fee._id);
    await healthSectionDoc.updateOne({
        fees: healthFees,
    });
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
