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

class Mailer {
  private _from: string;

  constructor() {
    this._from = `Kakeibo <webdevzino@gmail.com>`;
  }
  private newTransoporter() {
    return nodemailer.createTransport({
      ...smtpConfig,
    });
  }

  private async sendEmail(
    template: string,
    subject: string,
    url: string,
    firstName: string,
    to: string
  ) {
    const srcFolderPath = path.join(__dirname, "..");
    const html = pug.renderFile(
      path.join(srcFolderPath, "templates", `${template}.pug`),
      {
        firstName,
        subject,
        url,
      }
    );

    const mailOptions = {
      from: this._from,
      to,
      subject,
      text: convert(html),
      html,
    };

    const info = await this.newTransoporter().sendMail(mailOptions);
    console.log(nodemailer.getTestMessageUrl(info));
  }

  async sendVerificationCode(url: string, firstName: string, to: string) {
    await this.sendEmail(
      "verificationCode",
      "Your account verification code",
      url,
      firstName,
      to
    );
  }
}

export default Mailer;
