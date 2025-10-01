import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmail = async (email: string, otp: string) => {
  try {
    const msg = {
      to: email,
      from: 'no-reply@notesapp.com', // must be verified in SendGrid
      subject: 'Your OTP for Email Verification',
      html: `
        <div style="font-family: Arial, sans-serif; line-height:1.5;">
          <h2>Email Verification</h2>
          <p>Your One-Time Password (OTP) is:</p>
          <h1 style="color:#4CAF50;">${otp}</h1>
          <p>This OTP will expire in <b>10 minutes</b>. Do not share it with anyone.</p>
        </div>
      `,
    };

    const response = await sgMail.send(msg);
    console.log('✅ OTP email sent via SendGrid API');
    return response;
  } catch (error) {
    console.error('❌ Error sending OTP email via SendGrid API:', error);
    throw new Error('Could not send OTP email.');
  }
};