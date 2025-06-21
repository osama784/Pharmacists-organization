import mongoose from "mongoose";
import { config } from "dotenv";
config();

export default (async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI_ONLINE);
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
})();
