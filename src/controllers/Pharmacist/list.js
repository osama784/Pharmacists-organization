import Pharmacist from "../../models/Pharmacist";

const listPharmacists = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const results = await Pharmacist.find().skip(skip).limit(limit);

        const total = await Pharmacist.countDocuments();

        res.json({
            data: results,
            meta: {
                totalItems: total,
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                itemsPerPage: limit,
            },
        });
        return;
    } catch (e) {
        next(e);
    }
};

export default listPharmacists;
