import { sendEmail } from "../services/sendEmail.js";

export default {
    email(req, res) {
        try {
            const { to, senderEmail, subject, text } = req.body;

            if (!to || !senderEmail || !subject || !text)
                throw new Error("Missing values", { cause: { code: 400 } });

            const isMailSent = sendEmail(to, senderEmail, subject, text);
            if (!isMailSent)
                throw new Error("The email could not be sent", {
                    cause: { code: 400 },
                });

            return res.status(201).json(isMailSent);
        } catch (err) {
            if (err.cause) {
                const { code } = err.cause;
                return res.status(code).json({ error: err.message });
            }

            return res
                .status(500)
                .json({ error: `Internal Server Error: ${err.message}` });
        }
    },
};
