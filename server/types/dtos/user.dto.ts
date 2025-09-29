import { z } from "zod";
import userValidationSchema from "../../validators/user.schema";
import { PopulatedUserDocument } from "../models/user.types";
import { RoleDocument } from "../models/role.types";

export type UserCreateDto = z.infer<typeof userValidationSchema>;
export type UserUpdateDto = Partial<UserCreateDto>;

export type UserResponseDto = {
    id: string;
    username: string;
    email: string;
    phoneNumber: string;
    status: string;
    role: string | RoleDocument;
};

export function toUserResponseDto(data: PopulatedUserDocument): UserResponseDto;
export function toUserResponseDto(data: PopulatedUserDocument[]): UserResponseDto[];

export function toUserResponseDto(data: PopulatedUserDocument | PopulatedUserDocument[]): UserResponseDto | UserResponseDto[] {
    if (Array.isArray(data)) {
        const result: UserResponseDto[] = [];
        for (const doc of data) {
            result.push(_toListUsersResponseDto(doc));
        }
        return result;
    }
    return _toUserResponseDto(data);
}

function _toUserResponseDto(doc: PopulatedUserDocument): UserResponseDto {
    return {
        id: doc.id,
        username: doc.username,
        email: doc.email,
        phoneNumber: doc.phoneNumber,
        status: doc.status,
        role: doc.role,
    };
}

function _toListUsersResponseDto(doc: PopulatedUserDocument): UserResponseDto {
    return {
        id: doc._id.toString(),
        username: doc.username,
        email: doc.email,
        phoneNumber: doc.phoneNumber,
        status: doc.status,
        role: doc.role.name,
    };
}
