import nodemailer from "nodemailer";
import Jwt from "jsonwebtoken";
import { emailTemplate } from "./emailTemplate.js";

export const sendEmail = async (email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: "mohamedabdelazim654@gmail.com",
      pass: "ividdywzqbdpoyyr",
    },
  });

  let token = Jwt.sign({ email }, "myProjectAddress");
  const info = await transporter.sendMail({
    from: '"mohamedabdelazim" <mohamedabdelazim654@gmail.com>', // sender address
    to: email, // list of receivers// Subject line
    html: emailTemplate(token), // html body
  });

  console.log("Message sent: %s", info.messageId);
};
