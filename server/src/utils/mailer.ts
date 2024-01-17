import nodemailer from "nodemailer";
import { convert } from "html-to-text";
import pug from "pug";
import * as path from "path";
import config from "config";

const smtpConfig = config.get<{
  host: string;
  port: number;
  user: string;
  pass: string;
}>("smtp");

class Mailer {
  private _from: string;

  constructor() {
    this._from = `Kakeibo <webdevzino@gmail.com>`;
  }
  private newTransoporter() {
    return nodemailer.createTransport({
      ...smtpConfig,
      auth: {
        user: smtpConfig.user,
        pass: smtpConfig.pass,
      },
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
