import { IMailer } from "../interfaces/IMailer";
import nodemailer from "nodemailer";
export class Mailer implements IMailer{
    async SendEmail(to: string, data: any) {
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "ashikms1998@gmail.com",
    pass: "szpm pzah egss rmzo",
  },
});

async function main() {
  const info = await transporter.sendMail({
    from: '"Zealio.live 👻" <zealio.live@gmail.com>', // sender address
    to: `${to}`, // list of receivers
    subject: "Verification Mail from Zealio✔", // Subject line
    text: "This is to verify your account,Enter below code to verify your mail", // plain text body
    html: data,
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

main().catch(console.error);
return true
}
}