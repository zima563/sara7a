import QRCode from "qrcode";

import { messageModel } from "../../../databases/models/messageModel.js";
import { catchError } from "../../middlewares/catchError.js";
import { appError } from "../../utils/appError.js";

const allMessages = catchError(async (req, res) => {
  let messages = await messageModel.find().populate("receiveId", "name");
  res.json({ msg: "success", messages });
});

const getMessage = catchError(async (req, res) => {
  let messages = await messageModel
    .findById(req.params.id)
    .populate("receiveId", "name");
  res.json({ msg: "success", messages });
});

const addMessage = catchError(async (req, res) => {
  await messageModel.insertMany(req.body);
  res.json({ msg: "success" });
});
const messagesOfUser = catchError(async (req, res) => {
  let messages = await messageModel.find({ receiveId: req.userId });
  if (!messages) return next(new appError("not messages found", 404));
  res.status(200).json({ msg: "success", messages });
});

const shareProfile = catchError(async (req, res) => {
  QRCode.toDataURL(process.env.URL_OF_QR, (err, qr) => {
    res.json({ msg: "success", qr });
  });
});

export { addMessage, allMessages, getMessage, shareProfile, messagesOfUser };
