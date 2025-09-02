import mongoose, { Schema } from "mongoose";
import { IInvoiceModel, InvoiceDocument } from "../types/models/invoice.types.js";
import { createInvoiceDto } from "../types/dtos/invoice.dto.js";
import { syndicateMembershipsTR } from "../translation/models.ar.js";
import { PharmacistDocument } from "../types/models/pharmacist.types.js";
import Fee, { REREGISTRATION_FEES } from "./fee.model.js";
import { FeeDocument, PopulatedFeeDocument } from "../types/models/fee.types.js";
import SyndicateMembership from "./syndicateMembership.model.js";
import Section from "./section.model.js";
import staticData from "../config/static-data.json";
import { SectionDocument } from "../types/models/section.types.js";
import Counter from "./counter.model.js";

export const invoiceStatuses = {
    paid: "مدفوع",
    ready: "جاهزة للإرسال",
    cancelled: "ملغاة",
};

const Invoice = new Schema<InvoiceDocument>(
    {
        serialID: { type: String, unique: true },
        receiptNumber: String,
        pharmacist: { type: Schema.Types.ObjectId, ref: "Pharmacist", required: true },
        bank: {
            name: { type: String, required: true },
            accounts: [{ _id: false, section: String, accountNum: String }],
        },
        status: { type: String, required: true },
        syndicateMembership: { type: String, required: true },
        isFinesIncluded: Boolean,
        fees: [
            {
                _id: false,
                name: { type: String, required: true },
                value: { type: Number, required: true },
                numOfYears: { type: Number, required: true },
            },
        ],
        total: Number,
        paidDate: Date,
    },
    { timestamps: true }
);

Invoice.pre("save", async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findOneAndUpdate({ name: "invoice" }, { $inc: { value: 1 } }, { new: true, upsert: true });
            this.serialID = counter.value.toString();
            next();
        } catch (e) {
            next(e as Error);
        }
    } else {
        next();
    }
});

export const getPharmacistRelatedFees = async (
    validatedData: createInvoiceDto,
    pharmacist: PharmacistDocument
): Promise<{ name: string; value: number; numOfYears: number }[]> => {
    let lastTimePaidYear = pharmacist.lastTimePaid?.getFullYear();
    const graduationYear = pharmacist.graduationYear.getFullYear();
    const currentYear = new Date().getFullYear();
    let age = currentYear - pharmacist.birthDate.getFullYear();

    // finding the required year (the last year he paid at, or the graduation year if he didn't pay before)
    let syndicateMembershipStatus: string;
    let requiredYear = graduationYear;
    let shouldPayReregistrationFees: boolean = false;
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
        } else if (difference > 2) {
            if (validatedData.syndicateMembership.includes("غير مزاول")) {
                syndicateMembershipStatus = syndicateMembershipsTR["re-registration-of-non-practitioner"];
            } else {
                syndicateMembershipStatus = syndicateMembershipsTR["re-registration-of-practitioner"];
            }
        } else {
            // this pharmacist has already paid his fees, (difference = 0)
            const allFees = await Fee.find();
            const result: { name: string; value: number; numOfYears: number }[] = allFees.map((fee) => {
                return {
                    name: fee.name,
                    value: 0,
                    numOfYears: 0,
                };
            });

            return result;
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
        // check for Reregistration fees
        if (
            validatedData.syndicateMembership == syndicateMembershipsTR["re-registration-of-non-practitioner"] ||
            validatedData.syndicateMembership == syndicateMembershipsTR["re-registration-of-practitioner"]
        ) {
            shouldPayReregistrationFees = true;
        }
    }
    // initiating some variables to track fees and their values
    let fees: { name: string; value: number; numOfYears: number }[] = [];
    let excludedFees: string[] = [];
    let value = 0;
    let numOfYears = 0;

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
                numOfYears = currentYear - requiredYear + 1;
                while (tmpYear != currentYear + 1) {
                    value += fee.details?.get(`${tmpYear}`)!;
                    tmpYear += 1;
                }
                tmpYear = requiredYear;
            } else if (fee.isRepeatable) {
                value = fee.value! * (currentYear - requiredYear + 1);
                numOfYears = currentYear - requiredYear + 1;
            } else {
                value = fee.value!;
                numOfYears = 1;
            }

            fees.push({
                name: fee.name,
                value: value,
                numOfYears,
            });
            excludedFees.push(fee.name);
            value = 0;
            numOfYears = 0;
        });
        // calculate last year
        if (validatedData.willPracticeThisYear) {
            const practicingYearSyndicateMembership = await SyndicateMembership.findOne({
                name: syndicateMembershipsTR["practicing-year"],
            }).populate<{
                fees: PopulatedFeeDocument[];
            }>({
                path: "fees",
                populate: {
                    path: "section",
                },
            });
            practicingYearSyndicateMembership?.fees.forEach((fee) => {
                if (fee.isMutable) {
                    // value just for this year
                    value = fee.details?.get(`${currentYear}`)!;
                } else {
                    value = fee.value!;
                }
                const existBefore = fees.findIndex((_fee) => fee.name == _fee.name);
                if (existBefore != -1) {
                    if (fee.isRepeatable) {
                        fees[existBefore] = {
                            name: fee.name,
                            value: fees[existBefore].value + value,
                            numOfYears: fees[existBefore].numOfYears + 1,
                        };
                    }
                } else {
                    fees.push({
                        name: fee.name,
                        value: value,
                        numOfYears: 1,
                    });
                    excludedFees.push(fee.name);
                }

                value = 0;
            });
        } else {
            const unPracticingYearSyndicateMembership = await SyndicateMembership.findOne({
                name: syndicateMembershipsTR["non-practicing-year"],
            }).populate<{
                fees: PopulatedFeeDocument[];
            }>({
                path: "fees",
                populate: {
                    path: "section",
                },
            });
            unPracticingYearSyndicateMembership?.fees.forEach((fee) => {
                if (fee.isMutable) {
                    // value just for this year
                    value = fee.details?.get(`${currentYear}`)!;
                } else {
                    value = fee.value!;
                }
                const existBefore = fees.findIndex((_fee) => fee.name == _fee.name);
                if (existBefore != -1) {
                    if (fee.isRepeatable) {
                        fees[existBefore] = {
                            name: fee.name,
                            value: fees[existBefore].value + value,
                            numOfYears: fees[existBefore].numOfYears + 1,
                        };
                    }
                } else {
                    fees.push({
                        name: fee.name,
                        value: value,
                        numOfYears: 1,
                    });
                    excludedFees.push(fee.name);
                }

                value = 0;
            });
        }

        if (shouldPayReregistrationFees) {
            REREGISTRATION_FEES.forEach(async (fee) => {
                const existBefore = fees.findIndex((_fee) => fee == _fee.name);
                if (existBefore != -1) {
                    // find the fee to get its value
                    const currentFee = await Fee.findOne({ name: fee });
                    if (currentFee?.isRepeatable) {
                        fees[existBefore] = {
                            name: fee,
                            value: fees[existBefore].value + value,
                            numOfYears: fees[existBefore].numOfYears + 1,
                        };
                    }
                } else {
                    fees.push({
                        name: fee,
                        value: value,
                        numOfYears: 1,
                    });
                    excludedFees.push(fee);
                }

                value = 0;
            });
        } else {
            // zeroing these fees
            REREGISTRATION_FEES.forEach(async (fee) => {
                const existBefore = fees.findIndex((_fee) => fee == _fee.name);
                if (existBefore != -1) {
                    fees[existBefore] = {
                        name: fee,
                        value: 0,
                        numOfYears: 0,
                    };
                }

                value = 0;
            });
        }
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
        if (validatedData.willPracticeThisYear) {
            nonPracticingSyndicateMembership?.fees.forEach((fee) => {
                if (fee.isMutable) {
                    // summing value depending from last year to current year
                    let tmpYear = requiredYear;
                    numOfYears = currentYear - requiredYear;
                    while (tmpYear != currentYear) {
                        value += fee.details?.get(`${tmpYear}`)!;
                        tmpYear += 1;
                    }
                    tmpYear = requiredYear;
                } else if (fee.isRepeatable) {
                    value = fee.value! * (currentYear - requiredYear);
                    numOfYears = currentYear - requiredYear;
                } else {
                    value = fee.value!;
                    numOfYears = 1;
                }

                fees.push({
                    name: fee.name,
                    value: value,
                    numOfYears,
                });
                excludedFees.push(fee.name);
                value = 0;
                numOfYears = 0;
            });
            const oneYearPracticingSyndicateMembership = await SyndicateMembership.findOne({
                name: syndicateMembershipsTR["practicing-year"],
            }).populate<{
                fees: PopulatedFeeDocument[];
            }>({
                path: "fees",
                populate: {
                    path: "section",
                },
            });
            // fees for practicing thi year
            oneYearPracticingSyndicateMembership?.fees.forEach((fee) => {
                if (fee.isMutable) {
                    // value just for this year
                    value = fee.details?.get(`${currentYear}`)!;
                } else {
                    value = fee.value!;
                }
                const existBefore = fees.findIndex((_fee) => fee.name == _fee.name);
                if (existBefore != -1) {
                    if (fee.isRepeatable) {
                        fees[existBefore] = {
                            name: fee.name,
                            value: fees[existBefore].value + value,
                            numOfYears: fees[existBefore].numOfYears + 1,
                        };
                    }
                } else {
                    fees.push({
                        name: fee.name,
                        value: value,
                        numOfYears: 1,
                    });
                    excludedFees.push(fee.name);
                }

                value = 0;
            });
        } else {
            nonPracticingSyndicateMembership?.fees.forEach((fee) => {
                if (fee.isMutable) {
                    // summing value depending from last year to current year
                    let tmpYear = requiredYear;
                    numOfYears = currentYear - requiredYear + 1;
                    while (tmpYear != currentYear + 1) {
                        value += fee.details?.get(`${tmpYear}`)!;
                        tmpYear += 1;
                    }
                    tmpYear = requiredYear;
                } else if (fee.isRepeatable) {
                    value = fee.value! * (currentYear - requiredYear + 1);
                    numOfYears = currentYear - requiredYear + 1;
                } else {
                    value = fee.value!;
                    numOfYears = 1;
                }

                fees.push({
                    name: fee.name,
                    value: value,
                    numOfYears,
                });
                excludedFees.push(fee.name);
                value = 0;
                numOfYears = 0;
            });
        }
        // check re-registartion fee for two years practicing
        if (
            [syndicateMembershipsTR["two-years-of-non-practicing"], syndicateMembershipsTR["two-years-of-practicing"]].includes(
                syndicateMembershipStatus
            )
        ) {
            const reregistrationDate = staticData["re-registration-date"];
            if (Date.now() < Date.parse(reregistrationDate)) {
                fees = fees.map((fee) => {
                    if (REREGISTRATION_FEES.includes(fee.name)) {
                        return {
                            ...fee,
                            value: 0,
                            numOfYears: 0,
                        };
                    }
                    return fee;
                });
            }
        }
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

        if (validatedData.willPracticeThisYear) {
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
                    // summing value depending from last year to (current year - 1)
                    let tmpYear = requiredYear;
                    numOfYears = currentYear - requiredYear + 1;
                    while (tmpYear != currentYear + 1) {
                        value += fee.details?.get(`${tmpYear}`)!;
                        tmpYear += 1;
                    }
                    tmpYear = requiredYear;
                } else if (fee.isRepeatable) {
                    value = fee.value! * (currentYear - requiredYear + 1);
                    numOfYears = currentYear - requiredYear + 1;
                } else {
                    value = fee.value!;
                    numOfYears = 1;
                }

                fees.push({
                    name: fee.name,
                    value: value,
                    numOfYears,
                });
                excludedFees.push(fee.name);
                value = 0;
                numOfYears = 0;
            });
        } else {
            // this year they will not practice
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
                    // summing value depending from last year to (current year - 1)
                    let tmpYear = requiredYear;
                    numOfYears = currentYear - requiredYear;
                    while (tmpYear != currentYear) {
                        value += fee.details?.get(`${tmpYear}`)!;
                        tmpYear += 1;
                    }
                    tmpYear = requiredYear;
                } else if (fee.isRepeatable) {
                    value = fee.value! * (currentYear - requiredYear);
                    numOfYears = currentYear - requiredYear;
                } else {
                    value = fee.value!;
                    numOfYears = 1;
                }

                fees.push({
                    name: fee.name,
                    value: value,
                    numOfYears,
                });
                excludedFees.push(fee.name);
                value = 0;
                numOfYears = 0;
            });
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
                    value = fee.details?.get(`${currentYear}`)!;
                } else {
                    value = fee.value!;
                }

                const existBefore = fees.findIndex((_fee) => fee.name == _fee.name);
                if (existBefore != -1) {
                    if (fee.isRepeatable) {
                        fees[existBefore] = {
                            name: fee.name,
                            value: fees[existBefore].value + value,
                            numOfYears: fees[existBefore].numOfYears + 1,
                        };
                    }
                } else {
                    fees.push({
                        name: fee.name,
                        value: value,
                        numOfYears: 1,
                    });
                    excludedFees.push(fee.name);
                }

                value = 0;
            });
        }
    }
    // add fineSummeryFees which related to sections to exculdedIDs
    const sections = await Section.find().populate<{
        fineableFees: FeeDocument[];
        fineSummaryFee: FeeDocument;
    }>("fineableFees fineSummaryFee");
    sections.forEach((section) => {
        excludedFees.push(section.fineSummaryFee.name);
    });

    // calculate fines
    const finesDate = new Date(staticData["fines-date"]);
    let fineSummaryFeeValue = 0;
    let currentFee = null;
    if (new Date() >= finesDate && validatedData.calculateFines != undefined && validatedData.calculateFines == true) {
        sections.forEach((section) => {
            section.fineableFees.forEach((fee) => {
                currentFee = fees.filter((obj) => obj.name == fee.name)[0];
                if (!currentFee) {
                    return;
                }
                fineSummaryFeeValue += (currentFee.value * 25) / 100;
            });
            fees.push({
                name: section.fineSummaryFee.name,
                value: fineSummaryFeeValue,
                numOfYears: 1,
            });
            fineSummaryFeeValue = 0;
        });
    } else {
        sections.forEach((section) => {
            fees.push({
                name: section.fineSummaryFee.name,
                value: 0,
                numOfYears: 1,
            });
        });
    }
    // appending other fees that is not related with the practice type with a value of 0.
    const otherFees = await Fee.find({
        name: {
            $nin: excludedFees,
        },
    })
        .select("_id name section")
        .populate<{ section: SectionDocument }>("section");

    otherFees.forEach((fee) => {
        fees.push({
            name: fee.name,
            value: 0,
            numOfYears: 0,
        });
    });

    // handling custom Fees
    fees = fees.map((fee) => {
        if (fee.name == "رسم السن") {
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
                value: FeeAgeValue * (currentYear - requiredYear + 1),
                numOfYears: currentYear - requiredYear + 1,
            };
        }
        if (
            fee.name == "مطبوعات" &&
            [syndicateMembershipsTR["affiliation"], syndicateMembershipsTR["foreign-affiliation"]].includes(syndicateMembershipStatus)
        ) {
            const prints = staticData["prints"];
            const value = Object.values(prints).reduce((acc, currentValue) => acc + currentValue, 0);
            return {
                ...fee,
                value: value,
            };
        }
        if (fee.name == "رسوم سنين سابقة") {
            if (
                [
                    syndicateMembershipsTR["non-practicing-year"],
                    syndicateMembershipsTR["two-years-of-non-practicing"],
                    syndicateMembershipsTR["re-registration-of-non-practitioner"],
                ].includes(syndicateMembershipStatus)
            ) {
                if (!validatedData.willPracticeThisYear) {
                    return {
                        ...fee,
                        value: 60000 * (currentYear - requiredYear + 1),
                    };
                } else {
                    return {
                        ...fee,
                        value: 60000 * (currentYear - requiredYear) + 20000,
                    };
                }
            } else {
                if (validatedData.willPracticeThisYear) {
                    return {
                        ...fee,
                        value: 20000 * (currentYear - requiredYear + 1),
                    };
                } else {
                    return {
                        ...fee,
                        value: 20000 * (currentYear - requiredYear) + 60000,
                    };
                }
            }
        }
        return fee;
    });

    return fees;
};

export default mongoose.model<InvoiceDocument, IInvoiceModel>("Invoice", Invoice, "invoices");
