import joi from "joi";

const addMsgValidation = joi.object({
  message: joi.string().min(2).max(200).required(),
  receiveId: joi.string().hex().length(24),
});

const getMessageValidation = joi.object({
  id: joi.string().hex().length(24),
});

export { addMsgValidation, getMessageValidation };
