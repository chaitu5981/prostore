import { Order } from "@/types";
import { render } from "@react-email/render";
import nodemailer from "nodemailer";
import EmailTemplate from "./email-template";
import { currencyFormatter, formatDate } from "@/lib/utils";
export const sendMail = async (order: Order) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "chaitu.raju@gmail.com",
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
  const htmlContent = await render(<EmailTemplate order={order} />);
  await transporter.sendMail({
    from: "chaitu.raju@gmail.com",
    to: order.user.email,
    subject: "Thanks for the purchase",
    html: htmlContent,
  });
};
