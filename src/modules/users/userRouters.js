import express from "express";
import {
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
} from "./userControllers.js";
import { checkEmailExist } from "../../middlewares/checkEmailExist.js";
import { validation } from "../../middlewares/validation.js";
import {
  ChangePasswordvalidator,
  checkpinCodeValidator,
  deleteUseValidator,
  forgettingPasswordValidator,
  getUserValidator,
  resetPasswordValidator,
  signinValidator,
  signupValidator,
  updateUserValidator,
} from "./userValidation.js";
import { auth } from "../../middlewares/auth.js";
import { checkVerify } from "../../middlewares/checkVerifyEmail.js";

const userRouter = express.Router();

userRouter.post(
  "/signup",
  validation(signupValidator),
  checkEmailExist,
  signup
);

userRouter.route("/verify/:token").get(verify);
userRouter.post("/login", validation(signinValidator), signin);
userRouter.route("/unsupscribe").post(auth, checkVerify, unsupscriberEmail);
userRouter.route("/users").get(getallUser);
userRouter.route("/viewUser").get(auth, viewUser);
userRouter.route("/softDelete").post(auth, softDelete);

userRouter
  .route("/updateUser")
  .put(auth, validation(updateUserValidator), updateUser);

userRouter
  .route("/changePassword")
  .put(auth, validation(ChangePasswordvalidator), ChangePassword);

userRouter
  .route("/users/:id")
  .get(validation(getUserValidator), getUser)
  .delete(auth, validation(deleteUseValidator), deleteUser);

userRouter
  .route("/forgettingPassword")
  .post(validation(forgettingPasswordValidator), forgettingPassword);

userRouter
  .route("/checkpinCode")
  .post(validation(checkpinCodeValidator), checkpinCode);

userRouter
  .route("/resetPassword")
  .post(validation(resetPasswordValidator), resetPassword);

export default userRouter;
