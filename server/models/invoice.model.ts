import mongoose, { Schema } from "mongoose";
import { IInvoiceModel, InvoiceDocument } from "../types/models/invoice.types.js";
import { createInvoiceDto } from "../types/dtos/invoice.dto.js";
import { syndicateMembershipsTR } from "../translation/models.ar.js";
import { PharmacistDocument } from "../types/models/pharmacist.types.js";
import Fee, { REREGISTRATION_FEES } from "./fee.model.js";
import { FeeDocument } from "../types/models/fee.types.js";
import SyndicateMembership from "./syndicateMembership.model.js";
import Section from "./section.model.js";
import staticData from "../config/static-data.json";
import Counter from "./counter.model.js";

export const invoiceStatuses = {
    paid: "مدفوع",
    ready: "جاهزة للإرسال",
    cancelled: "ملغاة",
};

const Invoice = new Schema<InvoiceDocument>(
    {
        serialID: { type: String, unique: true, index: true, required: true },
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
        images: [String],
        total: Number,
        paidDate: Date,
    },
    { timestamps: true }
);

Invoice.pre("validate", async function (next) {
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
    }
    // initiating some variables to track fees and their values
    let fees: { name: string; value: number; numOfYears: number }[] = [];
    let excludedFees: string[] = [];
    let value = 0;
    let numOfYears = 0;

    if ([syndicateMembershipsTR["foreign-affiliation"], syndicateMembershipsTR["affiliation"]].includes(syndicateMembershipStatus)) {
        const affiliationSyndicateMembership = await SyndicateMembership.findOne({ name: syndicateMembershipStatus }).populate<{
            fees: FeeDocument[];
        }>("fees");
        // adding related fees' values
        affiliationSyndicateMembership?.fees.forEach((fee) => {
            handleNewFee(fees, fee, excludedFees, { currentYear, requiredYear });
        });
        // calculate practicing fee
        const practicingFee = await Fee.findOne({ name: "رسم المزاولة" });
        if (validatedData.willPracticeThisYear) {
            fees.push({
                name: practicingFee?.name!,
                value: practicingFee?.value! * (currentYear - requiredYear + 1),
                numOfYears: currentYear - requiredYear + 1,
            });
        } else {
            fees.push({
                name: practicingFee?.name!,
                value: practicingFee?.value! * (currentYear - requiredYear),
                numOfYears: currentYear - requiredYear,
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
            fees: FeeDocument[];
        }>("fees");
        if (validatedData.willPracticeThisYear) {
            nonPracticingSyndicateMembership?.fees.forEach((fee) => {
                handleNewFee(fees, fee, excludedFees, { currentYear, requiredYear: requiredYear - 1 });
            });
            const oneYearPracticingSyndicateMembership = await SyndicateMembership.findOne({
                name: syndicateMembershipsTR["practicing-year"],
            }).populate<{
                fees: FeeDocument[];
            }>("fees");
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
            });
        } else {
            nonPracticingSyndicateMembership?.fees.forEach((fee) => {
                handleNewFee(fees, fee, excludedFees, { currentYear, requiredYear });
            });
        }
        // check re-registartion fee for two years practicing
        if (
            [syndicateMembershipsTR["two-years-of-non-practicing"], syndicateMembershipsTR["two-years-of-practicing"]].includes(
                syndicateMembershipStatus
            )
        ) {
            const reregistrationDate = staticData["reregistrationDate"];
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
        if (syndicateMembershipsTR["practicing-year"] == syndicateMembershipStatus) {
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
                fees: FeeDocument[];
            }>("fees");
            practicingSyndicateMembership?.fees.forEach((fee) => {
                handleNewFee(fees, fee, excludedFees, { currentYear, requiredYear });
            });
        } else {
            // this year they will not practice
            const practicingSyndicateMembership = await SyndicateMembership.findOne({ name: syndicateMembershipStatus }).populate<{
                fees: FeeDocument[];
            }>("fees");
            practicingSyndicateMembership?.fees.forEach((fee) => {
                handleNewFee(fees, fee, excludedFees, { currentYear, requiredYear: requiredYear - 1 });
            });
            const nonPracticingSyndicateMembership = await SyndicateMembership.findOne(filter).populate<{
                fees: FeeDocument[];
            }>("fees");
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
    const finesDate = new Date(staticData["finesDate"]);
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
    // appending other fees that are not related with the practice type, with a value of 0.
    const otherFees = await Fee.find({
        name: {
            $nin: excludedFees,
        },
    }).select("_id name");

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
            } else if (
                [
                    syndicateMembershipsTR["practicing-year"],
                    syndicateMembershipsTR["two-years-of-practicing"],
                    syndicateMembershipsTR["re-registration-of-practitioner"],
                ].includes(syndicateMembershipStatus)
            ) {
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
            } else {
                return {
                    ...fee,
                    value: 60000 * (currentYear - requiredYear) + 20000,
                };
            }
        }
        return fee;
    });

    return fees;
};

const handleNewFee = (
    fees: { name: string; value: number; numOfYears: number }[],
    newFee: FeeDocument,
    excludedFees: string[],
    info: { currentYear: number; requiredYear: number }
) => {
    let numOfYears = info.currentYear - info.requiredYear + 1;
    let value = 0;
    if (newFee.isMutable) {
        // summing value depending from last year to current year
        let tmpYear = info.requiredYear;
        while (tmpYear != info.currentYear + 1) {
            value += newFee.details?.get(`${tmpYear}`)!;
            tmpYear += 1;
        }
        tmpYear = info.requiredYear;
    } else if (newFee.isRepeatable) {
        value = newFee.value! * numOfYears;
    } else {
        value = newFee.value!;
        numOfYears = 1;
    }

    fees.push({
        name: newFee.name,
        value: value,
        numOfYears,
    });
    excludedFees.push(newFee.name);
};

export default mongoose.model<InvoiceDocument, IInvoiceModel>("Invoice", Invoice, "invoices");
