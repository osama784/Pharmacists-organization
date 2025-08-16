import mongoose, { HydratedDocument, Model } from "mongoose";
import { RoleDocument } from "./role.types.js";

export interface IUser {
    username: string;
    email: string;
    password: string;
    phoneNumber: string;
    resetPasswordToken?: string;
    status: string;
    role: mongoose.Types.ObjectId;
}

export type UserDocument = HydratedDocument<IUser> & {
    createdAt: Date;
    updatedAt: Date;
};
export type PopulatedUserDocument = Omit<UserDocument, "role"> & {
    role: RoleDocument;
};

export interface IUserModel extends Model<UserDocument> {
    checkUniqueEmail(currentDocID: string | null, email: string): Promise<boolean>;
}
