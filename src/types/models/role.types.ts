import { HydratedDocument, Model } from "mongoose";

interface IRole {
    name: string;
    permissions: string[];
}

export type RoleDocument = HydratedDocument<IRole> & {
    createdAt: Date;
    updatedAt: Date;
};

export interface IRoleModel extends Model<RoleDocument> {
    checkUniqueName(name: string): Promise<boolean>;
}
