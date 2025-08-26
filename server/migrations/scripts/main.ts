import mongoose from "mongoose";
import "./db.script.js";
import createSections from "./createSections.script.js";
import createFees from "./createFees.script.js";
import createSyndicateMemberships from "./createSyndicateMemberships.script.js";
import createSuperUser from "./createSuperUser.script.js";
import assignFeesToSections from "./assignFeesToSections.script.js";
import createSuperAdminRole from "./createSuperAdminRole.js";
import custom from "./custom.script.js";
import createEmptyRole from "./createEmptyRole.script.js";

const main = async () => {
    // await createSections();
    // await createFees();
    // await assignFeesToSections();
    // await createSyndicateMemberships();
    // await createSuperUser();
    // await createSuperAdminRole();
    // await createEmptyRole();
    // await custom();
};
main();
