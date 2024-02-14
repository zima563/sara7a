import bcrypt from "bcryptjs";

import { userModel } from "../../databases/models/userModel.js";
import { appError } from "../utils/appError.js";

export const checkEmailExist = async (req, res, next) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (user) return next(new appError("user already exist", 409));

  req.body.password = bcrypt.hashSync(req.body.password);

  next();
};
