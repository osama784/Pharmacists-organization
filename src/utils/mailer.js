import nodemailer from "nodemailer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Configure transporter (example using Gmail)
const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "pharmacistsorganization@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

// Password reset email function
export const sendPasswordResetEmail = async (email, info) => {
    // Read HTML template
    const templatePath = path.join(__dirname, "..", "templates", "password-reset.html");
    let html = await fs.readFile(templatePath, "utf8");

    // Replace placeholders
    html = html
        .replace("{{currentYear}}", new Date().getFullYear())
        .replace("{{username}}", info.username)
        .replace("{{resetToken}}", info.resetToken);

    const mailOptions = {
        from: "pharmacistsorganization@gmail.com",
        to: email,
        subject: "Password Reset Request",
        html: html,
    };

    await transporter.sendMail(mailOptions);
};

export default transporter;
