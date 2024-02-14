import { userModel } from "../../databases/models/userModel.js";
import { appError } from "../utils/appError.js";

export const checkVerify = async (req, res, next) => {
  let user = await userModel.findById(req.userId);
  if (user.emailVerify) return next(new appError("your email already verify"));
  next();
};
