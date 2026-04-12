const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    // 1. Create a transporter (using Gmail as an example)
    const transporter = nodemailer.createTransport({
        // service: "Gmail",
        host: "sandbox.smtp.mailtrap.io",
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD, // Use an "App Password" for Gmail
        },

        // Activate in gmail -less secure app
    });
    // 2. Define email options
    const mailOptions = {
        from: "Liki <likispam600@gmail.com>",
        to: options.email,
        subject: options.subject,
        text: options.message,
        // html: `<p>${options.message}</p>` // Optional: use HTML for better styling
    };

    // 3. Send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;