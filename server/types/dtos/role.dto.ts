import { z } from "zod";
import RoleSchema from "../../validators/role.schema";
import { RoleDocument } from "../models/role.types";

export type CreateRoleDto = z.infer<typeof RoleSchema>;
export type UpdateRoleDto = Partial<CreateRoleDto>;

export type RoleResponseDto = {
    id: string;
    name: string;
    permissions: string[];
};

export function toRoleResponseDto(data: RoleDocument): RoleResponseDto;
export function toRoleResponseDto(data: RoleDocument[]): RoleResponseDto[];

export function toRoleResponseDto(data: RoleDocument | RoleDocument[]): RoleResponseDto | RoleResponseDto[] {
    if (Array.isArray(data)) {
        const result: RoleResponseDto[] = [];
        for (const doc of data) {
            result.push(_toRoleResponseDto(doc));
        }
        return result;
    }
    return _toRoleResponseDto(data);
}

function _toRoleResponseDto(doc: RoleDocument): RoleResponseDto {
    return {
        id: doc.id,
        name: doc.name,
        permissions: doc.permissions,
    };
}
