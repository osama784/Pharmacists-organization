import Pharmacist from "../../models/pharmacist.model.js";
import Fee from "../../models/fee.model.js";
import Section from "../../models/section.model.js";
import PracticeType from "../../models/practiceType.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { IFeeInvoice } from "../../types/models/invoice.types.js";
import { PopulatedFeeDocument } from "../../types/models/fee.types.js";
import { SectionDocument } from "../../types/models/section.types.js";

const getPharmacistRelatedFees = async (req: Request, res: TypedResponse<IFeeInvoice[]>, next: NextFunction) => {
    try {
        const pharmacist = await Pharmacist.findById(req.params.pharmacistID);
        if (!pharmacist) {
            res.status(404);
            return;
        }

        // extracting the related pracitceType to add the proper fees to the invoice document
        const practiceType = await PracticeType.findById(req.validatedData.practiceType).populate<{ fees: PopulatedFeeDocument[] }>({
            path: "fees",
            populate: {
                path: "section",
            },
        });

        let lastTimePaidYear = pharmacist.lastTimePaid.getFullYear();
        let graduationYear = pharmacist.graduationYear;
        const currentYear = new Date().getFullYear();
        let age = currentYear - pharmacist.birthDate.getFullYear();

        // finding the required year (the last year he paid at, or the graduation year if he didn't pay before)
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
        // assigning "requiredYear" to "tmpYear" to use it then with calculating fees' values
        let tmpYear = requiredYear;

        // initiating some variables to track fees and their values
        let fees: IFeeInvoice[] = [];
        let excludedIDs: string[] = [];
        let value = 0;

        // adding related fees' values
        practiceType?.fees.forEach((fee) => {
            if (fee.isMutable) {
                // summing value depending from last year to current year
                while (tmpYear != currentYear + 1) {
                    value += fee.details?.get(`${tmpYear}`)!;
                    tmpYear += 1;
                }
            } else if (fee.isRepeatable) {
                value = fee.value! * (currentYear - tmpYear + 1);
            } else {
                value = fee.value!;
            }

            fees.push({
                feeRef: fee._id,
                feeName: fee.name,
                sectionName: fee.section.name,
                value: value,
            });
            excludedIDs.push(fee.id);
            value = 0;
            tmpYear = requiredYear;
        });

        if (practiceType?.name == "سنة مزاول") {
            // changing the value of fee 'رسوم سنين سابقة' to the target value
            fees = fees.map((fee) => {
                if (fee.feeName == "رسوم سنين سابقة") {
                    return {
                        ...fee,
                        value: 20000,
                    };
                }
                return fee;
            });
        } else if (practiceType?.name == "سنة غير مزاول") {
            // changing the value of fee 'رسوم سنين سابقة' to the target value
            fees = fees.map((fee) => {
                if (fee.feeName == "رسوم سنين سابقة") {
                    return {
                        ...fee,
                        value: 60000,
                    };
                }
                return fee;
            });
        } else if (practiceType?.name == "انتساب" || practiceType?.name == "انتساب أجانب") {
            // checking if practiceType of type "انتساب" to add fees for "سنة مزاول" and if required other unPracticed practiceType
            const oneYearPracticedPracticeType = await PracticeType.findOne({ name: "سنة مزاول" }).populate<{
                fees: PopulatedFeeDocument[];
            }>({
                path: "fees",
                populate: { path: "section" },
            });
            oneYearPracticedPracticeType?.fees.forEach((fee) => {
                // check if fee exists before (prevent duplication)
                if (excludedIDs.includes(fee._id.toString())) {
                    return;
                }
                // finding the value of the fee
                if (fee.isMutable) {
                    value = fee.details?.get(`${currentYear}`)!;
                } else {
                    value = fee.value!;
                }
                fees.push({
                    feeRef: fee._id,
                    feeName: fee.name,
                    sectionName: fee.section.name,
                    value: value,
                });
                excludedIDs.push(fee.id);
                value = 0;
            });
            // changing the value of fee 'رسوم سنين سابقة' to the target value
            fees = fees.map((fee) => {
                if (fee.feeName == "رسوم سنين سابقة") {
                    return {
                        ...fee,
                        value: 20000,
                    };
                }
                return fee;
            });
            if (requiredYear != currentYear) {
                let practiceTypeForPreviousYears = null;
                const numberOfPreviousYears = currentYear - requiredYear;
                if (numberOfPreviousYears == 1) {
                    practiceTypeForPreviousYears = await PracticeType.findOne({ name: "سنة غير مزاول" }).populate<{
                        fees: PopulatedFeeDocument[];
                    }>({
                        path: "fees",
                        populate: { path: "section" },
                    });
                } else if (numberOfPreviousYears == 2) {
                    practiceTypeForPreviousYears = await PracticeType.findOne({ name: "سنة غير مزاول" }).populate<{
                        fees: PopulatedFeeDocument[];
                    }>({
                        path: "fees",
                        populate: { path: "section" },
                    });
                } else {
                    practiceTypeForPreviousYears = await PracticeType.findOne({ name: "إعادة قيد غير مزاول" }).populate<{
                        fees: PopulatedFeeDocument[];
                    }>({
                        path: "fees",
                        populate: { path: "section" },
                    });
                }
                practiceTypeForPreviousYears?.fees.forEach((fee) => {
                    // check if fee exists before (prevent duplication)
                    if (excludedIDs.includes(fee.id)) {
                        return;
                    }
                    // finding the value of the fee
                    if (fee.isMutable) {
                        while (tmpYear != currentYear) {
                            value += fee.details?.get(`${tmpYear}`)!;
                            tmpYear += 1;
                        }
                    } else {
                        if (fee.isRepeatable) {
                            value = fee.value! * numberOfPreviousYears;
                        } else {
                            value = fee.value!;
                        }
                    }
                    fees.push({
                        feeRef: fee._id,
                        feeName: fee.name,
                        sectionName: fee.section.name,
                        value: value,
                    });
                    excludedIDs.push(fee.id);
                    // re-initiating values
                    value = 0;
                    tmpYear = requiredYear;
                });
                // changing the value of fee 'رسوم سنين سابقة' to the target value
                fees = fees.map((fee) => {
                    if (fee.feeName == "رسوم سنين سابقة") {
                        return {
                            ...fee,
                            value: 80000,
                        };
                    }
                    return fee;
                });
            }
        }

        // add fineSummeryFees which related to sections to exculdedIDs
        const sections = await Section.find();
        sections.forEach((section) => {
            excludedIDs.push(section.fineSummaryFee.toString());
        });

        // appending other fees that is not related with the practice type with a value of 0.
        const otherFees = await Fee.find({
            _id: {
                $nin: excludedIDs,
            },
        })
            .select("_id name section")
            .populate<{ section: SectionDocument }>("section");

        otherFees.forEach((fee) => {
            fees.push({
                feeRef: fee._id,
                feeName: fee.name,
                sectionName: fee.section.name,
                value: 0,
            });
        });

        // handling fee with name "رسم السن"
        fees = fees.map((fee) => {
            if (fee.feeName == "رسم السن") {
                let valueOfFeeAge = 0;
                if (age <= 30) {
                    valueOfFeeAge = 5000;
                } else if (age >= 31 && age < 40) {
                    valueOfFeeAge = 10000;
                } else if (age >= 41 && age < 50) {
                    valueOfFeeAge = 15000;
                } else {
                    valueOfFeeAge = 20000;
                }
                return {
                    ...fee,
                    value: valueOfFeeAge,
                };
            }
            return fee;
        });

        res.json({ success: true, data: fees });
    } catch (e) {
        next(e);
    }
};

export default getPharmacistRelatedFees;
