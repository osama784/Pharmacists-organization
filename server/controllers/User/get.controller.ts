import { NextFunction, Request, TypedResponse } from "express";
import User from "../../models/user.model.js";
import { responseMessages } from "../../translation/response.ar.js";
import { toUserResponseDto, UserResponseDto } from "../../types/dtos/user.dto.js";
import { RoleDocument } from "../../types/models/role.types.js";

const getUser = async (req: Request, res: TypedResponse<UserResponseDto>, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id).populate<{ role: RoleDocument }>("role");
        if (!user) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        res.json({ success: true, data: toUserResponseDto(user) });
    } catch (e) {
        next(e);
    }
};

export default getUser;
