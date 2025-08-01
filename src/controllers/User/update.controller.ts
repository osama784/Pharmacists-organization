import User from "../../models/user.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { responseMessages } from "../../translation/response.ar.js";
import { RoleDocument } from "../../types/models/role.types.js";
import { toUserResponseDto, UserResponseDto } from "../../types/dtos/user.dto.js";

const updateUser = async (req: Request, res: TypedResponse<UserResponseDto>, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(400).json({ success: false, details: [responseMessages.NOT_FOUND] });
            return;
        }
        const email = req.validatedData.email;
        if (email) {
            const exists = await User.checkUniqueEmail(req.params.id, email);

            if (exists) {
                res.status(400).json({ success: false, details: [responseMessages.USER_CONTROLLERS.UNIQUE_EMAIL] });
                return;
            }
        }
        await user.updateOne({ $set: req.validatedData });

        const doc = await User.findById(user._id).populate<{ role: RoleDocument }>("role");
        res.json({ success: true, data: toUserResponseDto(doc!) });
    } catch (e) {
        next(e);
    }
};

export default updateUser;
