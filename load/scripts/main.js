import mongoose from "mongoose";
import "./db.js";
import createSections from "./createSections.js";
import { createFees } from "./createFees.js";
import createPracticeTypes from "./createPracticeTypes.js";
import createSuperUser from "./createSuperUser.js";
import { assignFeesToSections } from "./assignFeesToSections.js";
import createSuperAdminRole from "./createSuperAdminRole.js";

const main = async () => {
    // await createSections();
    // await createFees();
    // await assignFeesToSections();
    // await createPracticeTypes();
    await createSuperUser();
    await createSuperAdminRole();
};
await main();
