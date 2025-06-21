import User from "../../models/User.js";

const listUsers = async (req, res, next) => {
    try {
        let queries = req.query;
        const page = parseInt(queries.page) || 1;
        const limit = parseInt(queries.limit) || 10;
        const skip = (page - 1) * limit;

        queries = Object.fromEntries(
            Object.entries(queries).filter(([key, value]) => {
                return Object.keys(User.schema.paths).includes(key);
            })
        );

        const result = await User.find(queries).skip(skip).limit(limit);

        const total = await User.countDocuments();

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

export default listUsers;
