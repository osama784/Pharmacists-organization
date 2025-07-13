import User from "../../models/user.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { RoleDocument } from "../../types/models/role.types.js";
import { responseMessages } from "../../translation/response.ar.js";
import { toUserResponseDto, UserResponseDto } from "../../types/dtos/user.dto.js";

const createUser = async (req: Request, res: TypedResponse<UserResponseDto>, next: NextFunction) => {
    try {
        const email = req.validatedData.email;
        const exists = await User.checkUniqueEmail(null, email);
        if (exists) {
            res.status(400).json({ success: false, details: [responseMessages.USER_CONTROLLERS.UNIQUE_EMAIL] });
            return;
        }

        const user = await User.create(req.validatedData);
        const doc = await User.findById(user._id).populate<{ role: RoleDocument }>("role");
        res.json({ success: true, data: toUserResponseDto(doc!) });
    } catch (e) {
        next(e);
    }
};

export default createUser;
