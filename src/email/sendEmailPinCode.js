import nodemailer from "nodemailer";

export const sendEmailPcode = async (email, pinCode) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: "mohamedabdelazim654@gmail.com",
      pass: "ividdywzqbdpoyyr",
    },
  });

  const info = await transporter.sendMail({
    from: '"mohamedabdelazim" <mohamedabdelazim654@gmail.com>', // sender address
    to: email,
    subject: "PIN CODE forgetting password", // list of receivers// Subject line
    html: `<b>${pinCode}</b>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
};
