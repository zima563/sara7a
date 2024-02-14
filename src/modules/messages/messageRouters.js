import express from "express";
import {
  addMessage,
  allMessages,
  shareProfile,
  getMessage,
  messagesOfUser,
} from "./messageControllers.js";
import { auth } from "../../middlewares/auth.js";
import { validation } from "../../middlewares/validation.js";
import { addMsgValidation, getMessageValidation } from "./messageValidation.js";

const messsageRouter = express.Router();

messsageRouter
  .route("/addMessage")
  .post(auth, validation(addMsgValidation), addMessage);
messsageRouter.route("/allMessage").get(allMessages);

messsageRouter.route("/shareProfile").get(shareProfile);

messsageRouter
  .route("/message/:id")
  .get(validation(getMessageValidation), getMessage);

messsageRouter.route("/messageOfUser").get(auth, messagesOfUser);

export default messsageRouter;
