import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: process.env.SMTP_PORT,
	secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
	service: process.env.SMTP_SERVICE,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

const sendEmail = async (to, subject, html) => {
	try {
		const info = await transporter.sendMail({
			from: `"Hina " <${process.env.SMTP_USER}>`,
			to,
			subject,
			html,
		});
		console.log(`Email sent: ${info.messageId}`);
	} catch (err) {
		console.error(`Error sending email: ${err.message}`);
	}
};

export { sendEmail };
