import nodemailer from 'nodemailer';

export const sendEmail = async (email: string, otp: string) => {
  try {
    // SendGrid SMTP transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.sendgrid.net',
      port: 587, // or 465 if you prefer SSL
      auth: {
        user: 'apikey', // literally the word 'apikey'
        pass: process.env.SENDGRID_API_KEY, // your SendGrid API key from Render env
      },
    });

    // Mail options
    const mailOptions = {
      from: `"Notes App" <no-reply@notesapp.com>`, // can be any verified sender in SendGrid
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
  } catch (error) {
    console.error('❌ Error sending OTP email:', error);
    throw new Error('Could not send OTP email.');
  }
};