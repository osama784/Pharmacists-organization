import Invoice from "../../models/Invoice";
import Pharmacist from "../../models/Pharmacist";
import Fee from "../../models/Fee";

const createInvoice = async (req, res, next) => {
    try {
        const pharmacist = await Pharmacist.findById(req.params.pharmacistID);
        if (!pharmacist) {
            res.status(404);
            return;
        }

        const invoice = await (await Invoice.create({ ...req.validatedData, pharmacist })).populate("practiceType");
        const practiceType = await invoice.practiceType.populate({
            populate: {
                path: "fees",
                populate: {
                    path: "section",
                },
            },
        });
        let lastTimePaidYear = pharmacist.lastTimePaid.getFullYear();
        let graduationYear = pharmacist.graduationYear;
        const currentYear = new Date().getFullYear();
        let age = currentYear - pharmacist.birthDate.getFullYear();
        let fees = [];
        let excludedIDs = [];

        // finding the required year (the last year he paid at, or the graduation year if he didn't pay before)
        let value = 0;
        let requiredYear = graduationYear;
        if (lastTimePaidYear) {
            requiredYear = lastTimePaidYear;
        } else {
            if (age >= 25) {
                let yearWhenAge25 = pharmacist.birthDate.getFullYear() + 25;
                if (yearWhenAge25 < graduationYear) {
                    requiredYear = yearWhenAge25;
                } else {
                    requiredYear = graduationYear;
                }
            } else {
                requiredYear = graduationYear;
            }
        }

        practiceType.fees.forEach((fee) => {
            if (fee.get("isMutable")) {
                // summing value depending from last year to current year
                while (requiredYear != currentYear + 1) {
                    value += fee.get("details")[`${requiredYear}`];
                    requiredYear += 1;
                }
            } else if (fee.isRepeatable) {
                value = fee.value * (currentYear - requiredYear + 1);
            } else {
                value = fee.value;
            }

            fees.push({
                section: fee.section.name,
                name: fee.name,
                value: value,
            });
            excludedIDs.push(fee._id);
        });

        // appending other fees that is not related with the practice type with a value of 0.
        const otherFees = await Fee.find({
            _id: {
                $nin: excludedIDs,
            },
        })
            .select("_id name section")
            .populate("section");

        otherFees.forEach((fee) => {
            fees.push({
                section: fee.section.name,
                name: fee.name,
                value: 0,
            });
        });
        invoice.fees = fees;
        const doc = await invoice.save();

        res.status(200).json(doc);
    } catch (e) {
        next(e);
    }
};

export default createInvoice;
