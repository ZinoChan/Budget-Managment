import nodemailer, { SendMailOptions } from "nodemailer";
import { HttpException } from "@/exceptions/httpException";
import { HttpStatusCodes } from "@/constants";
import {
  NODE_MAILER_HOST,
  NODE_MAILER_PASS,
  NODE_MAILER_PORT,
  NODE_MAILER_SECURE,
  NODE_MAILER_USER,
} from "@/config";

async function createTestCreds() {
  const creds = await nodemailer.createTestAccount();
  console.log({ creds });
}

createTestCreds();

const smtpConfig = {
  auth: {
    user: NODE_MAILER_USER!,
    pass: NODE_MAILER_PASS!,
  },
  host: NODE_MAILER_HOST!,
  port: Number(NODE_MAILER_PORT)!,
  secure: NODE_MAILER_SECURE === "true",
};

const transporter = nodemailer.createTransport({ ...smtpConfig });

async function sendEmail(payload: SendMailOptions) {
  transporter.sendMail(payload, (err, info) => {
    if (err) {
      console.log(err);
      throw new HttpException(
        HttpStatusCodes.INTERNAL_SERVER_ERROR,
        "Error sending email"
      );
    }
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  });
}

export default sendEmail;
