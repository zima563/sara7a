import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import randomstring from "randomstring";

import { userModel } from "../../../databases/models/userModel.js";
import { sendEmail } from "../../email/sendEmail.js";
import { catchError } from "../../middlewares/catchError.js";
import { appError } from "../../utils/appError.js";
import { sendEmailPcode } from "../../email/sendEmailPinCode.js";

const signup = catchError(async (req, res) => {
  await userModel.insertMany(req.body);
  sendEmail(req.body.email);

  res.json({ msg: "success" });
});

const verify = catchError(async (req, res, next) => {
  Jwt.verify(req.params.token, process.env.JWT_KEY, async (err, decoded) => {
    if (err) return next(new appError(err, 401));
    await userModel.findOneAndUpdate(
      { email: decoded.email },
      { emailVerify: true }
    );
  });
  res.json({ msg: "success" });
});

const signin = catchError(async (req, res, next) => {
  let user = await userModel.findOneAndUpdate(
    { email: req.body.email },
    { isActive: true },
    { new: true }
  );
  if (user && (await bcrypt.compare(req.body.password, user.password))) {
    let token = Jwt.sign(
      { userID: user._id, role: user.role, isActive: user.isActive },
      process.env.JWT_KEY
    );

    return res.json({ msg: "login...", token });
  }
  next(new appError("email or password incorrect", 401));
});

const unsupscriberEmail = catchError(async (req, res, next) => {
  await userModel.findByIdAndDelete(req.userId);
  res.json({ msg: "unsubscribe email successfully" });
});

const forgettingPassword = catchError(async (req, res, next) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (!user) return next(new appError("not found email", 404));
  const pinCode = randomstring.generate({ length: 4, charset: "numeric" });
  let updateUser = await userModel.findOneAndUpdate(
    { email: req.body.email },
    { pinCode: pinCode, resetVerified: false },
    { new: true }
  );

  sendEmailPcode(user.email, user.pinCode);

  res.json({ msg: "send of message successfully", updateUser });
});

const checkpinCode = catchError(async (req, res, next) => {
  let user = await userModel.findOne({
    email: req.body.email,
    pinCode: req.body.pinCode,
  });
  if (!user) {
    user.pinCode = undefined;
    user.resetVerified = undefined;
    await user.save();
    next(new appError("email or pinCode incorrect"));
  } else {
    user.pinCode = undefined;
    user.resetVerified = true;
    await user.save();
    res.json({ msg: "verification of pinCode is successfully" });
  }
});

const resetPassword = catchError(async (req, res, next) => {
  let user = await userModel.findOne({ email: req.body.email });
  if (!user) return next(new appError("not found email", 404));
  if (!user.resetVerified) return next(new appError("reset code not verify"));
  user.pinCode = undefined;
  user.resetVerified = undefined;
  user.password = bcrypt.hashSync(req.body.newPassword);
  await user.save();
  let token = Jwt.sign(
    { userID: user._id, role: user.role, isActive: user.isActive },
    process.env.JWT_KEY
  );
  res.status(200).json({ msg: "reset password is success ", token });
});

//update user (age , firstName , lastName)(user mustbe logged in)
const updateUser = catchError(async (req, res, next) => {
  let user = await userModel.findByIdAndUpdate(
    req.userId,
    {
      name: req.body.firstName + req.body.lastName,
      age: req.body.age,
    },
    {
      new: true,
    }
  );
  res.json({ msg: "success", user });
});

//delete user(user must be logged in)
const ChangePassword = catchError(async (req, res) => {
  let currentUser = await userModel.findById(req.userId);
  if (!currentUser) return next(new appError("not user found by this id", 404));
  let isCorrectPassword = await bcrypt.compare(
    req.body.currentPassword,
    currentUser.password
  );
  if (!isCorrectPassword)
    return next(new appError("incorrect current password", 401));
  // if (req.body.password !== req.body.confirmPassword)
  //   return res.json({ msg: "password confirmation incorrect" });

  let user = await userModel.findByIdAndUpdate(
    req.userId,
    {
      password: bcrypt.hashSync(req.body.password, 12),
    },
    {
      new: true,
    }
  );

  if (!user) return next(new appError("user not found by this id", 404));
  res.json({ msg: "success", user });
});

const getallUser = catchError(async (req, res, next) => {
  let users = await userModel.find();
  res.status(200).json({ msg: "success", users });
});

const getUser = catchError(async (req, res, next) => {
  let user = await userModel.findById(req.params.id);
  if (!user) return next(new appError("not found user", 404));
  res.status(200).json({ msg: "success", user });
});

const viewUser = catchError(async (req, res, next) => {
  let user = await userModel.findById(req.userId);
  res.status(200).json({ msg: "success", user });
});

//delete user(user must be logged in)
const deleteUser = catchError(async (req, res, next) => {
  let user = await userModel.findByIdAndDelete(req.params.id);
  if (!user) return next(new appError("user not found by this id", 404));
  res.json({ msg: "success" });
});

//soft delete(user must be logged in)
const softDelete = catchError(async (req, res, next) => {
  let user = await userModel.findById(req.userId);
  if (!user) return next(new appError("user not found", 404));

  if (await userModel.findByIdAndUpdate(req.userId, { isDeleted: true }))
    return res.json({ msg: "user is soft deleted" });

  next(new appError("soft deleted not executed", 400));
});

export {
  signup,
  signin,
  verify,
  unsupscriberEmail,
  forgettingPassword,
  checkpinCode,
  resetPassword,
  getallUser,
  updateUser,
  ChangePassword,
  getUser,
  viewUser,
  deleteUser,
  softDelete,
};
