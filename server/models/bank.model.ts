import mongoose, { Schema } from "mongoose";
import { BankDocument, IBankModel } from "../types/models/bank.types";

const Bank = new Schema<BankDocument>({
    name: { type: String, required: true },
    accounts: [{ _id: false, section: String, accountNum: String }],
});

Bank.method("getAccount", function (this: BankDocument, section: string) {
    const account = this.accounts.findIndex((account) => account.section == section);
    return this.accounts[account];
});

export default mongoose.model<BankDocument, IBankModel>("Bank", Bank, "banks");
