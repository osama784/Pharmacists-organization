import User from "../../models/User.js";
import Role from "../../models/Role.js";

const listUsers = async (req, res, next) => {
    try {
        // let queries = req.query;
        // const page = parseInt(queries.page) || 1;
        // const limit = parseInt(queries.limit) || 10;
        // const skip = (page - 1) * limit;

        // queries = Object.fromEntries(
        //     Object.entries(queries).filter(([key, value]) => {
        //         return Object.keys(User.schema.paths).includes(key);
        //     })
        // );

        const { role, email, username, phoneNumber, status, page = "1", limit = "10" } = req.query;
        const skip = (page - 1) * limit;
        const filters = {};
        if (role && typeof role == "object") {
            let roleFilter = {};
            if ("name" in role) {
                if (typeof role.name == "object" && "$regex" in role.name && typeof role.name.$regex == "string") {
                    roleFilter = { name: { ...role.name, $options: "i" } };
                } else if (typeof role.name == "string") {
                    roleFilter = role;
                }
            }
            if (roleFilter) {
                const docs = await Role.find(roleFilter);
                const docsIDs = docs.map((doc) => doc._id);
                filters.role = { $in: docsIDs };
            }
        }
        if (email) {
            if (typeof email == "object" && "$regex" in email && typeof email.$regex == "string") {
                filters.email = { ...email, $options: "i" };
            } else if (typeof email == "string") {
                filters.email = email;
            }
        }
        if (username) {
            if (typeof username == "object" && "$regex" in username && typeof username.$regex == "string") {
                filters.username = { ...username, $options: "i" };
            } else if (typeof username == "string") {
                filters.username = username;
            }
        }
        if (phoneNumber && typeof phoneNumber == "string") filters.phoneNumber = phoneNumber;
        if (status && typeof status == "string") filters.status = status;

        const users = await User.find(filters).skip(skip).limit(limit).populate("role", "name").leanWithId();
        const result = users.map((user) => ({
            ...user,
            role: user.role.name || null, // Handle missing roles
        }));

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
