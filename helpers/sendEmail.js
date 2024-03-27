import nodemailer from "nodemailer"

const { META_PASSWORD } = process.env;

//465 25 465, 2525
const nodemailerConfig = {
    host: "smtp.meta.ua",
    port: 465,
    secure: true,
    auth: {
        user: "mangenda@meta.ua",
        pass: META_PASSWORD
    }
};

const transport = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = async (data) => {
    try {
        const email = await { ...data, from: "mangenda@meta.ua" }
        await transport.sendMail(email)
        console.log("Email send success")
    } catch (error) {
        console.error("Error sending email:", error);
    }
}