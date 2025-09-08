import { NextFunction, Request, TypedResponse } from "express";
import { responseMessages } from "../../translation/response.ar";
import Section from "../../models/section.model";
import Invoice, { invoiceStatuses } from "../../models/invoice.model";
import { FeeDocument } from "../../types/models/fee.types";
import { InvoiceResponseDto, toInvoiceResponseDto } from "../../types/dtos/invoice.dto";

const invoicesReport = async (req: Request, res: TypedResponse<InvoiceResponseDto[]>, next: NextFunction) => {
    try {
        const { section, startDate, endDate } = req.query;
        const page = parseInt(req.query.page as string) || 0;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = page * limit;
        if (!section || typeof section != "string") {
            res.status(400).json({ success: false, details: [responseMessages.REPORTS_CONTOLLERS.MISSING_VALUES] });
            return;
        }
        let filter: Record<string, any> = { status: invoiceStatuses.paid };
        if (startDate && typeof startDate == "string" && !isNaN(Date.parse(startDate))) {
            filter.createdAt = { $gte: new Date(startDate) };
        }
        if (endDate && typeof endDate == "string" && !isNaN(Date.parse(endDate))) {
            const date = new Date(endDate);
            date.setDate(date.getDate() + 1);
            filter.createdAt = { ...filter.createdAt, $lte: date };
        }

        const sectionDoc = await Section.findOne({ name: section }).populate<{ fees: FeeDocument[] }>("fees");
        if (!sectionDoc) {
            res.status(400).json({ success: false, details: [responseMessages.REPORTS_CONTOLLERS.SECTION_NOT_FOUND] });
            return;
        }

        const invoices = await Invoice.find(filter).skip(skip).limit(limit);

        const result: InvoiceResponseDto[] = [];
        for (const invoice of invoices) {
            const fees = invoice.fees.filter((fee) => {
                const exist = sectionDoc.fees.findIndex((element) => element.name == fee.name);
                return exist != -1 ? true : false;
            });
            result.push({ ...toInvoiceResponseDto(invoice), fees: fees });
        }

        const totalItems = await Invoice.find(filter).countDocuments();
        res.json({
            success: true,
            data: result,
            meta: {
                totalItems: totalItems,
                currentPage: page,
                totalPages: Math.ceil(totalItems / limit),
                itemsPerPage: limit,
            },
        });
    } catch (e) {
        next(e);
    }
};

export default invoicesReport;
