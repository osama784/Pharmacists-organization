import Invoice, { invoiceStatuses } from "../../models/invoice.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { responseMessages } from "../../translation/response.ar.js";
import { InvoiceResponseDto, toInvoiceResponseDto, updateInvoiceDto } from "../../types/dtos/invoice.dto.js";
import { PharmacistDocument } from "../../types/models/pharmacist.types.js";
import Pharmacist from "../../models/pharmacist.model.js";
import Section from "../../models/section.model.js";
import { FeeDocument } from "../../types/models/fee.types.js";
import Counter from "../../models/counter.model.js";
import Bank from "../../models/bank.model.js";
import { InvoiceModelTR } from "../../translation/models.ar.js";
import path from "path";
import fs from "fs/promises";
import { PARENT_DIR, processPharmacistImage } from "../../utils/images.js";

const updateInvoice = async (
    req: Request,
    res: TypedResponse<Omit<InvoiceResponseDto, "fees"> & { fees: Record<string, any> }>,
    next: NextFunction
) => {
    const validatedData: updateInvoiceDto = req.validatedData;
    const status = validatedData.status;

    try {
        const invoice = await Invoice.findOne({ serialID: req.params.id });
        if (!invoice) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        let updatedFields: Record<string, any> = { ...validatedData, updatedAt: Date.now() };
        // update "total" filed if "fees" field gets changed
        if (validatedData.fees) {
            const total = validatedData.fees.reduce((sum, fee) => sum + Number(fee.value), 0);
            updatedFields = {
                ...updatedFields,
                total: total,
            };
        }
        if (validatedData.bank) {
            const bank = await Bank.findById(validatedData.bank);
            if (!bank) {
                res.status(400).json({ success: false, details: [`${InvoiceModelTR.bank}: ${responseMessages.NOT_FOUND}`] });
                return;
            }
            updatedFields = {
                ...updatedFields,
                bank: { name: bank.name, accounts: bank.accounts },
            };
        }

        if (status == invoiceStatuses.paid) {
            const receiptNumber = await Counter.findOneAndUpdate(
                { name: "invoiceReceiptNumber" },
                { $inc: { value: 1 } },
                { new: true, upsert: true }
            );
            updatedFields = {
                ...updatedFields,
                receiptNumber: receiptNumber.value.toString(),
                paidDate: invoice.createdAt,
            };
            // updating "lastTimePaid" for the related pharmacist
            await Pharmacist.updateOne(
                { _id: invoice.pharmacist },
                {
                    lastTimePaid: invoice.createdAt,
                }
            );
        }
        const newImages = validatedData.images;
        const oldImages = invoice.images;
        let imagesURLs: string[] = [];
        if (newImages) {
            // check if added a new url to the source array
            for (const image of newImages) {
                if (!oldImages.includes(image)) {
                    res.status(400).json({ success: false, details: [responseMessages.PHARMACIST_CONTROLLERS.PREVENT_ADDING_IMAGES_URLS] });
                    return;
                }
            }
            // handle deleted images
            const deletedImages = oldImages.filter((image) => !newImages.includes(image));
            for (const image of deletedImages) {
                const imagePath = path.join(PARENT_DIR, image);
                try {
                    await fs.unlink(imagePath);
                } catch (e) {
                    console.log(e);
                }
            }
            imagesURLs = newImages;
        } else {
            imagesURLs = oldImages;
        }
        // handle uploaded images
        if (req.files) {
            for (const file of req.files as Express.Multer.File[]) {
                const processedImage = await processPharmacistImage(
                    file,
                    {
                        supportsWebP: res.locals.supportsWebP,
                        isLegacyBrowser: res.locals.isLegacyBrowser,
                    },
                    { imageType: "invoice", pharmacistId: invoice.pharmacist.toString(), invoiceId: invoice.serialID }
                );
                if (!imagesURLs.includes(processedImage.imageURL)) {
                    imagesURLs.push(processedImage.imageURL);
                }
                try {
                    await fs.unlink(file.path);
                } catch (e) {
                    console.log(e);
                }
            }
        }

        await invoice.updateOne({ $set: { ...updatedFields, images: imagesURLs } });

        const doc = await Invoice.findById(invoice._id).populate<{ pharmacist: PharmacistDocument }>("pharmacist");
        let serializedDoc = toInvoiceResponseDto(doc!);
        const sections = await Section.find().populate<{ fees: FeeDocument[] }>("fees");
        let serializedFees: Record<string, any> = {};

        for (const section of sections) {
            let sectionTotalFeesValue = 0;
            const sectionFees = section.fees.map((fee) => {
                const currentFee = serializedDoc.fees!.find((element) => element.name == fee.name);
                if (!currentFee) {
                    return;
                }
                sectionTotalFeesValue += Number(currentFee.value);
                return {
                    name: fee.name,
                    value: currentFee.value,
                    numOfYears: currentFee.numOfYears,
                };
            });
            serializedFees[section.name] = {};
            serializedFees[section.name]["fees"] = sectionFees.sort((a, b) => a?.name!.localeCompare(b?.name!)!);
            serializedFees[section.name]["total"] = sectionTotalFeesValue;
        }

        res.json({ success: true, data: { ...serializedDoc, fees: serializedFees } });
        return;
    } catch (e) {
        next(e);
    }
};

export default updateInvoice;
