import { HydratedDocument, Model } from "mongoose";

interface IRole {
    name: string;
    permissions: string[];
    checkUniqueName(name: string): Promise<boolean>;
}

export type RoleDocument = HydratedDocument<IRole>;

export interface IRoleModel extends Model<RoleDocument> {
    checkUniqueName(name: string): Promise<boolean>;
}
