import Pharmacist from "../../models/pharmacist.model.js";
import Fee from "../../models/fee.model.js";
import Section from "../../models/section.model.js";
import SyndicateMembership from "../../models/syndicateMembership.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { IFeeInvoice } from "../../types/models/invoice.types.js";
import { PopulatedFeeDocument } from "../../types/models/fee.types.js";
import { SectionDocument } from "../../types/models/section.types.js";
import { responseMessages } from "../../translation/response.ar.js";
import { syndicateMembershipsTR } from "../../translation/models.ar.js";
import staticData from "../../config/static-data.json";

const getPharmacistRelatedFees = async (req: Request, res: TypedResponse<IFeeInvoice[]>, next: NextFunction) => {
    try {
        if (!req.body || !req.body.syndicateMembership || !Object.values(syndicateMembershipsTR).includes(req.body.syndicateMembership)) {
            res.status(400).json({ success: false, details: [responseMessages.FEE_CONTROLLERS.MISSING_SYNDICATE_MEMBERSHIP] });
            return;
        }
        const validatedData: { syndicateMembership: string } = req.body;
        const pharmacist = await Pharmacist.findById(req.params.pharmacistID);
        if (!pharmacist) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }

        // extracting the related pracitceType to add the proper fees to the invoice document
        const syndicateMembershipDoc = await SyndicateMembership.findOne({ name: validatedData.syndicateMembership }).populate<{
            fees: PopulatedFeeDocument[];
        }>({
            path: "fees",
            populate: {
                path: "section",
            },
        });

        let lastTimePaidYear = pharmacist.lastTimePaid?.getFullYear();
        let graduationYear = pharmacist.graduationYear;
        const currentYear = new Date().getFullYear();
        let age = currentYear - pharmacist.birthDate.getFullYear();

        // finding the required year (the last year he paid at, or the graduation year if he didn't pay before)
        let syndicateMembershipStatus: string;
        let requiredYear = graduationYear;
        if (lastTimePaidYear) {
            requiredYear = lastTimePaidYear + 1;
            const difference = currentYear - requiredYear + 1;
            if (difference == 1) {
                if (validatedData.syndicateMembership.includes("غير مزاول")) {
                    syndicateMembershipStatus = syndicateMembershipsTR["non-practicing-year"];
                } else {
                    syndicateMembershipStatus = syndicateMembershipsTR["practicing-year"];
                }
            } else if (difference == 2) {
                if (validatedData.syndicateMembership.includes("غير مزاول")) {
                    syndicateMembershipStatus = syndicateMembershipsTR["two-years-of-non-practicing"];
                } else {
                    syndicateMembershipStatus = syndicateMembershipsTR["two-years-of-practicing"];
                }
            } else {
                if (validatedData.syndicateMembership.includes("غير مزاول")) {
                    syndicateMembershipStatus = syndicateMembershipsTR["re-registration-of-non-practitioner"];
                } else {
                    syndicateMembershipStatus = syndicateMembershipsTR["re-registration-of-practitioner"];
                }
            }
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
            if (pharmacist.nationality.includes("سوري")) {
                syndicateMembershipStatus = syndicateMembershipsTR["affiliation"];
            } else {
                syndicateMembershipStatus = syndicateMembershipsTR["foreign-affiliation"];
            }
        }
        // initiating some variables to track fees and their values
        let fees: IFeeInvoice[] = [];
        let excludedIDs: string[] = [];
        let value = 0;

        if ([syndicateMembershipsTR["foreign-affiliation"], syndicateMembershipsTR["affiliation"]].includes(syndicateMembershipStatus)) {
            const affiliationSyndicateMembership = await SyndicateMembership.findOne({ name: syndicateMembershipStatus }).populate<{
                fees: PopulatedFeeDocument[];
            }>({
                path: "fees",
                populate: {
                    path: "section",
                },
            });
            // adding related fees' values
            affiliationSyndicateMembership?.fees.forEach((fee) => {
                if (fee.isMutable) {
                    // summing value depending from last year to current year
                    let tmpYear = requiredYear;
                    while (tmpYear != currentYear + 1) {
                        value += fee.details?.get(`${tmpYear}`)!;
                        tmpYear += 1;
                    }
                    tmpYear = requiredYear;
                } else if (fee.isRepeatable) {
                    value = fee.value! * (currentYear - requiredYear + 1);
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
        } else if (
            [
                syndicateMembershipsTR["non-practicing-year"],
                syndicateMembershipsTR["re-registration-of-non-practitioner"],
                syndicateMembershipsTR["two-years-of-non-practicing"],
            ].includes(syndicateMembershipStatus)
        ) {
            const nonPracticingSyndicateMembership = await SyndicateMembership.findOne({ name: syndicateMembershipStatus }).populate<{
                fees: PopulatedFeeDocument[];
            }>({
                path: "fees",
                populate: {
                    path: "section",
                },
            });
            nonPracticingSyndicateMembership?.fees.forEach((fee) => {
                if (fee.isMutable) {
                    // summing value depending from last year to current year
                    let tmpYear = requiredYear;
                    while (tmpYear != currentYear + 1) {
                        value += fee.details?.get(`${tmpYear}`)!;
                        tmpYear += 1;
                    }
                    tmpYear = requiredYear;
                } else if (fee.isRepeatable) {
                    value = fee.value! * (currentYear - requiredYear + 1);
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
        } else {
            let filter;
            let calculateNonPracticed = true;
            if (syndicateMembershipsTR["practicing-year"] == syndicateMembershipStatus) {
                calculateNonPracticed = false;
            } else if (syndicateMembershipsTR["two-years-of-practicing"] == syndicateMembershipStatus) {
                filter = {
                    name: syndicateMembershipsTR["two-years-of-non-practicing"],
                };
            } else {
                filter = {
                    name: syndicateMembershipsTR["re-registration-of-non-practitioner"],
                };
            }

            if (calculateNonPracticed) {
                const nonPracticingSyndicateMembership = await SyndicateMembership.findOne(filter).populate<{
                    fees: PopulatedFeeDocument[];
                }>({
                    path: "fees",
                    populate: {
                        path: "section",
                    },
                });
                nonPracticingSyndicateMembership?.fees.forEach((fee) => {
                    if (fee.isMutable) {
                        // summing value depending from last year to (current year - 1)
                        let tmpYear = requiredYear;
                        while (tmpYear != currentYear) {
                            value += fee.details?.get(`${tmpYear}`)!;
                            tmpYear += 1;
                        }
                        tmpYear = requiredYear;
                    } else if (fee.isRepeatable) {
                        value = fee.value! * (currentYear - requiredYear);
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
            }
            const practicingSyndicateMembership = await SyndicateMembership.findOne({ name: syndicateMembershipStatus }).populate<{
                fees: PopulatedFeeDocument[];
            }>({
                path: "fees",
                populate: {
                    path: "section",
                },
            });
            practicingSyndicateMembership?.fees.forEach((fee) => {
                if (fee.isMutable) {
                    // value just for this year
                    value += fee.details?.get(`${currentYear}`)!;
                } else {
                    value = fee.value!;
                }
                let existBefore = false;
                fees.forEach((_fee, index) => {
                    if (fee._id.equals(_fee.feeRef)) {
                        existBefore = true;
                        if (fee.isRepeatable) {
                            fees[index] = {
                                feeRef: fee._id,
                                feeName: fee.name,
                                sectionName: fee.section.name,
                                value: fees[index].value + value,
                            };
                        }
                    }
                });
                if (!existBefore) {
                    fees.push({
                        feeRef: fee._id,
                        feeName: fee.name,
                        sectionName: fee.section.name,
                        value: value,
                    });
                    excludedIDs.push(fee.id);
                }

                value = 0;
            });
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
                let FeeAgeValue = 0;
                if (age <= 30) {
                    FeeAgeValue = 5000;
                } else if (age >= 31 && age < 40) {
                    FeeAgeValue = 10000;
                } else if (age >= 41 && age < 50) {
                    FeeAgeValue = 15000;
                } else {
                    FeeAgeValue = 20000;
                }
                return {
                    ...fee,
                    value: FeeAgeValue,
                };
            }
            if (
                fee.feeName == "مطبوعات" &&
                [syndicateMembershipsTR["affiliation"], syndicateMembershipsTR["foreign-affiliation"]].includes(syndicateMembershipStatus)
            ) {
                const prints = staticData["prints"];
                const value = Object.values(prints).reduce((acc, currentValue) => acc + currentValue, 0);
                return {
                    ...fee,
                    value: value,
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
