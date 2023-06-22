import nodemailer, { SendMailOptions } from "nodemailer";
import config from "config";
import { log } from "./logger";

// async function createTestCreds() {
//   const creds = await nodemailer.createTestAccount();
//   console.log({ creds });
// }

// createTestCreds();

const smtp = config.get<{
  user: string;
  pass: string;
  host: string;
  port: number;
  secure: boolean;
}>("smtp");

const transport = nodemailer.createTransport({
  ...smtp,
  auth: {
    user: smtp.user,
    pass: smtp.pass,
  },
});

async function sendEmail(payload: SendMailOptions) {
  transport.sendMail(payload, (err, info) => {
    if (err) {
      log.error(err, "Could not sent email");
      return;
    }
    log.info(`Preview Url: ${nodemailer.getTestMessageUrl(info)}`);
  });
}

export default sendEmail;
