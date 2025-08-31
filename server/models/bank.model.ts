import mongoose, { Schema } from "mongoose";
import { BankDocument, IBankModel } from "../types/models/bank.types";

const Bank = new Schema<BankDocument>({
    name: { type: String, required: true },
    accounts: [{ _id: false, section: String, accountNum: String }],
});

export default mongoose.model<BankDocument, IBankModel>("Bank", Bank, "banks");
