import Invoice from "../../models/Invoice.js";

const listInvoices = async (req, res, next) => {
    try {
        let queries = req.query;
        const page = parseInt(queries.page) || 1;
        const limit = parseInt(queries.limit) || 10;
        const skip = (page - 1) * limit;

        queries = Object.fromEntries(
            Object.entries(queries).filter(([key, value]) => {
                return Object.keys(Invoice.schema.paths).includes(key);
            })
        );

        const result = await Invoice.find(queries).select("-fees").skip(skip).limit(limit).populate("pharmacist practiceType");

        const total = await Invoice.countDocuments();

        res.json({
            success: true,
            data: result,
            meta: {
                totalItems: total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                itemsPerPage: limit,
            },
        });
    } catch (e) {
        next(e);
    }
};

export default listInvoices;
