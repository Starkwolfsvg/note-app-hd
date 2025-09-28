// server/src/utils/mailer.ts
import nodemailer from 'nodemailer';
export const sendOTPEmail = async (email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: Number(process.env.EMAIL_PORT),
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        const mailOptions = {
            from: 'Your Notes App <no-reply@notesapp.com>',
            to: email,
            subject: 'Your OTP for Email Verification',
            html: `<p>Your One-Time Password is: <strong>${otp}</strong></p><p>It will expire in 10 minutes.</p>`,
        };
        await transporter.sendMail(mailOptions);
        console.log('OTP email sent successfully');
    }
    catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Could not send OTP email.');
    }
};
