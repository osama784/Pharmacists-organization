import User from "../../dist/models/user.model.js";
import Role from "../../dist/models/role.model.js";
import bcrypt from "bcryptjs";
import createSuperAdminRole from "./createSuperAdminRole.js";
import { config } from "dotenv";
config();

const createUser = async () => {
    // await User.deleteMany();

    const role = await createSuperAdminRole();

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, salt);
    const user = await User.create({
        username: process.env.SUPER_ADMIN_USERNAME,
        email: process.env.SUPER_ADMIN_EMAIL,
        phoneNumber: "e231213",
        password: hash,
        phoneNumber: "32132",
        role: role,
    });
    console.log(user);
    const users = await User.find();
    console.log(users);
};

export default createUser;
