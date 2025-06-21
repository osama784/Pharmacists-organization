import User from "../../src/models/User.js";
import Role from "../../src/models/Role.js";
import bcrypt from "bcryptjs";
import createSuperAdminRole from "./createSuperAdminRole.js";
import { config } from "dotenv";
config();

const createUser = async () => {
    await User.deleteMany();

    const role = await createSuperAdminRole();

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(process.env.SUPER_ADMIN_PASSWORD, salt);
    const user = await User.create({
        username: process.env.SUPER_ADMIN_USERNAME,
        email: process.env.SUPER_ADMIN_EMAIL,
        password: hash,
        role: role,
    });
    console.log(user);
    const users = await User.find();
    console.log(users);
};

export default createUser;
