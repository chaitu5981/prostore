import nodemailer from "nodemailer";
export const sendMail = async (email: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "chaitu.raju@gmail.com",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });
  await transporter.sendMail({
    from : "chaitu.raju@gmail.com",
    to :email,
    subject:"Thanks for the purchase",
    text:"Your order is under process"
  })
};
