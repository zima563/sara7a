import joi from "joi";

const signupValidator = joi.object({
  name: joi.string().min(2).max(20).required(),
  email: joi.string().pattern(/[A-Za-z0-9]{3,50}@(gmail|yahoo).com$/),
  password: joi.string().pattern(/^[A-Z][a-z0-9@#$%^&*]{8,40}$/),
  rePassword: joi.valid(joi.ref("password")).required(),
  age: joi.string().pattern(/^[1-7][0-9]|80$/),
});

const signinValidator = joi.object({
  email: joi.string().pattern(/[A-Za-z0-9]{3,50}@(gmail|yahoo).com$/),
  password: joi.string().pattern(/^[A-Z][a-z0-9@#$%^&*]{8,40}$/),
});

const forgettingPasswordValidator = joi.object({
  email: joi.string().pattern(/^[A-Za-z0-9]{3,50}@(gmail|yahoo).com$/),
});

const checkpinCodeValidator = joi.object({
  email: joi.string().pattern(/^[A-Za-z0-9]{3,50}@(gmail|yahoo).com$/),
  pinCode: joi.string().pattern(/^[0-9][0-9][0-9][0-9]$/),
});

const resetPasswordValidator = joi.object({
  email: joi.string().pattern(/^[A-Za-z0-9]{3,50}@(gmail|yahoo).com$/),
  newPassword: joi.string().pattern(/^[A-Z][a-z0-9@#$%^&*]{8,40}$/),
});

const updateUserValidator = joi.object({
  firstName: joi.string().pattern(/^[A-Za-z]{2,20}$/),
  lastName: joi.string().pattern(/^[A-Za-z]{2,20}$/),
  age: joi.string().pattern(/^[1-7][0-9]|80$/),
});

const ChangePasswordvalidator = joi.object({
  currentPassword: joi.string().pattern(/^[A-Z][a-z0-9@#$%^&*]{8,40}$/),
  password: joi.string().pattern(/^[A-Z][a-z0-9@#$%^&*]{8,40}$/),
  confirmPassword: joi.valid(joi.ref("password")).required(),
});

const getUserValidator = joi.object({
  id: joi.string().hex().length(24),
});

const deleteUseValidator = joi.object({
  id: joi.string().hex().length(24),
});

export {
  signupValidator,
  signinValidator,
  forgettingPasswordValidator,
  checkpinCodeValidator,
  resetPasswordValidator,
  updateUserValidator,
  ChangePasswordvalidator,
  getUserValidator,
  deleteUseValidator,
};
