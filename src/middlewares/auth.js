import Jwt from "jsonwebtoken";
import { appError } from "../utils/appError.js";

export const auth = async (req, res, next) => {
  let token = req.headers.token;
  Jwt.verify(token, process.env.JWT_KEY, async (err, decoded) => {
    if (err) return next(new appError(err, 401));
    req.userId = decoded.userID;
    next();
  });
};
