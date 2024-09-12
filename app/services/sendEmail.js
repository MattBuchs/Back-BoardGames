import nodemailer from "nodemailer";

// Créez un transporteur pour envoyer des emails
const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.USER_EMAIL,
        pass: `#${process.env.PASS_EMAIL}`,
    },
});

export const sendEmail = (to, senderEmail, subject, text) => {
    const mailOptions = {
        from: "games@play-skroma.fr",
        to,
        subject,
        text: `Email de l'expéditeur : ${senderEmail}\n\n${text}`,
    };

    let isSent = true;
    transporter.sendMail(mailOptions, (error) => {
        if (error) isSent = false;
    });

    return isSent;
};
