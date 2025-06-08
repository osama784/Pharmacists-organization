import mongoose from "mongoose";
import { config } from "dotenv";
config();

export default (async () => {
    try {
        await mongoose.connect("mongodb://localhost:27017/Pharmacist");
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
})();
