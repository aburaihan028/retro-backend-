import nodemailer from "nodemailer";
import { CustomError } from "./customError.js";

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  secure: process.env.NODE_ENV === "development" ? false : true, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.HOST_MAIL,
    pass: process.env.APP_PASSWORD,
  },
});

export const sendmail = async (
  subject = "conform registration",
  templete,
  email,
) => {
  try {
    const info = await transporter.sendMail({
      from: "retrovibe@help.com", // sender address
      to: email, // list of recipients
      subject: subject,
      html: templete,
    });

    console.log("Message sent: %s", info.messageId);
    // Preview URL is only available when using an Ethereal test account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail:", err);
    throw new CustomError(501, "Mail not Send" + err);
  }
};
