import User from "../../models/user.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { RoleDocument } from "../../types/models/role.types.js";
import { responseMessages } from "../../translation/response.ar.js";
import { CreateUserDto, toUserResponseDto, UserResponseDto } from "../../types/dtos/user.dto.js";
import Role from "../../models/role.model.js";

const createUser = async (req: Request, res: TypedResponse<UserResponseDto>, next: NextFunction) => {
    try {
        const validatedData: CreateUserDto = req.validatedData;
        const email = validatedData.email;
        const exists = await User.checkUniqueEmail(null, email);
        if (exists) {
            res.status(400).json({ success: false, details: [responseMessages.USER_CONTROLLERS.UNIQUE_EMAIL] });
            return;
        }
        const role = await Role.findById(validatedData.role);
        if (!role) {
            res.status(400).json({ success: false, details: [responseMessages.USER_CONTROLLERS.ROLE_NOT_FOUND] });
            return;
        }
        const user = await User.create(validatedData);
        const doc = await User.findById(user._id).populate<{ role: RoleDocument }>("role");
        res.json({ success: true, data: toUserResponseDto(doc!) });
    } catch (e) {
        next(e);
    }
};

export default createUser;
