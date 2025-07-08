import User from "../../models/user.model.js";
import { NextFunction, Request, TypedResponse } from "express";
import { PopulatedUserDocument, UserDocument } from "../../types/models/user.types.js";
import { RoleDocument } from "../../types/models/role.types.js";
import { responseMessages } from "../../translation/response.ar.js";

const createUser = async (req: Request, res: TypedResponse<PopulatedUserDocument>, next: NextFunction) => {
    try {
        const email = req.validatedData.email;
        const exists = await User.checkUniqueEmail(null, email);
        if (exists) {
            res.status(400).json({ success: false, details: [responseMessages.USER_CONTROLLERS.UNIQUE_EMAIL] });
            return;
        }

        const user = await User.create(req.validatedData);
        const doc = await User.findById(user._id).populate<{ role: RoleDocument }>("role");
        res.json({ success: true, data: doc! });
    } catch (e) {
        next(e);
    }
};

export default createUser;
