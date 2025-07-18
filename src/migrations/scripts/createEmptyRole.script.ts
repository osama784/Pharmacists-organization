import Role from "../../models/role.model";

const createEmptyRole = async () => {
    let role = await Role.findOne({ name: "EMPTY" });
    if (!role) {
        role = await Role.create({
            name: "EMPTY",
        });
    }
    role.permissions = [];
    const doc = await role.save();
    console.log(doc);

    return doc;
};

export default createEmptyRole;
