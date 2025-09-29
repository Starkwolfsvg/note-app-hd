import nodemailer from 'nodemailer';
export const sendEmail = async (email, otp) => {
    try {
        // Gmail SMTP transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail', // built-in for Gmail
            auth: {
                user: process.env.EMAIL_USER, // your Gmail address
                pass: process.env.EMAIL_PASS, // 16-char app password
            },
        });
        // Mail options (same as before)
        const mailOptions = {
            from: `"Notes App" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Your OTP for Email Verification',
            html: `
        <div style="font-family: Arial, sans-serif; line-height:1.5;">
          <h2>Email Verification</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <h1 style="color:#4CAF50;">${otp}</h1>
          <p>This OTP will expire in <b>10 minutes</b>. Please do not share it with anyone.</p>
        </div>
      `,
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ OTP email sent:', info.messageId);
        return info;
    }
    catch (error) {
        console.error('❌ Error sending OTP email:', error);
        throw new Error('Could not send OTP email.');
    }
};
