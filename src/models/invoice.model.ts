import mongoose, { Schema } from "mongoose";
import { IInvoiceModel, InvoiceDocument } from "../types/models/invoice.types.js";
import { createInvoiceDto } from "../types/dtos/invoice.dto.js";
import { syndicateMembershipsTR } from "../translation/models.ar.js";
import { PharmacistDocument } from "../types/models/pharmacist.types.js";
import Fee from "./fee.model.js";
import { FeeDocument, PopulatedFeeDocument } from "../types/models/fee.types.js";
import SyndicateMembership from "./syndicateMembership.model.js";
import Section from "./section.model.js";
import staticData from "../config/static-data.json";
import { SectionDocument } from "../types/models/section.types.js";

export const invoiceStatuses = {
    paid: "مدفوع",
    ready: "جاهزة لللإرسال",
    cancelled: "ملغاة",
};

const Invoice = new Schema<InvoiceDocument>({
    pharmacist: { type: Schema.Types.ObjectId, ref: "Pharmacist", required: true },
    status: String,
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
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true },
});

// Invoice.pre("save", async function () {
//     if (this.isModified("fees")) {
//         const doc = await this.populate("fees");
//         this.total = doc.fees.reduce((sum, fee) => sum + fee.value, 0);
//     }
// });

export const getPharmacistRelatedFees = async (
    validatedData: createInvoiceDto,
    pharmacist: PharmacistDocument
): Promise<{ name: string; value: number; numOfYears: number }[]> => {
    let lastTimePaidYear = pharmacist.lastTimePaid?.getFullYear();
    const graduationYear = pharmacist.graduationYear.getFullYear();
    const currentYear = new Date().getFullYear();
    let age = currentYear - pharmacist.birthDate.getFullYear();
    const _fees: any[] = [];

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
            // this pharmacist has already paid his fees
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
                if (fee.name == _fee.name) {
                    existBefore = true;
                    if (fee.isRepeatable) {
                        fees[index] = {
                            name: fee.name,
                            value: fees[index].value + value,
                            numOfYears: fees[index].numOfYears + 1,
                        };
                    }
                }
            });
            if (!existBefore) {
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
    let isFinesIncluded = false;
    if (new Date() >= finesDate && validatedData.calculateFines != undefined && validatedData.calculateFines == true) {
        isFinesIncluded = true;
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

    // handling fee with name "رسم السن"
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
                value: FeeAgeValue,
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
        return fee;
    });

    return fees;
};

export default mongoose.model<InvoiceDocument, IInvoiceModel>("Invoice", Invoice, "invoices");
