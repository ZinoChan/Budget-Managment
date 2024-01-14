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
import { Prisma } from "@prisma/client";
import { convert } from "html-to-text";
import pug from "pug";
import * as path from "path";

const smtpConfig = {
  auth: {
    user: NODE_MAILER_USER!,
    pass: NODE_MAILER_PASS!,
  },
  host: NODE_MAILER_HOST!,
  port: Number(NODE_MAILER_PORT)!,
  user: NODE_MAILER_USER!,
  secure: NODE_MAILER_SECURE === "true",
  pass: NODE_MAILER_PASS!,
};

// const transporter = nodemailer.createTransport({ ...smtpConfig });

class Mailer {
  private _firstName: string;
  private _to: string;
  private _from: string;

  constructor(private user: Prisma.UserCreateInput, private url: string) {
    this._firstName = user.username;
    this._to = user.email;
    this._from = `Kakeibo <webdevzino@gmail.com>`;
  }
  private newTransoporter() {
    return nodemailer.createTransport({
      ...smtpConfig,
    });
  }

  private async sendEmail(template: string, subject: string) {
    const srcFolderPath = path.join(__dirname, "..");
    const html = pug.renderFile(
      path.join(srcFolderPath, "templates", `${template}.pug`),
      {
        firstName: this._firstName,
        subject,
        url: this.url,
      }
    );

    const mailOptions = {
      from: this._from,
      to: this._to,
      subject,
      text: convert(html),
      html,
    };

    const info = await this.newTransoporter().sendMail(mailOptions);
    console.log(nodemailer.getTestMessageUrl(info));
  }

  async sendVerificationCode() {
    await this.sendEmail("verificationCode", "Your account verification code");
  }
}

// async function sendEmail(payload: SendMailOptions) {
//   transporter.sendMail(payload, (err, info) => {
//     if (err) {
//       console.log(err);
//       throw new HttpException(
//         HttpStatusCodes.INTERNAL_SERVER_ERROR,
//         "Error sending email"
//       );
//     }
//     console.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
//   });
// }

// export default sendEmail;

export default Mailer;
