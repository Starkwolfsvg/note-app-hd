// server/src/controllers/authController.ts
import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendOTPEmail } from '../utils/mailer.js';

export const generateOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    let user = await User.findOne({ email });
    if (!user) {
      // For now, we'll create a user with a placeholder name.
      // The frontend should ideally send the name and DOB on first-time signup.
      user = new User({ email, name: 'New User', isVerified: false });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otp = hashedOtp;
    user.otpExpires = otpExpires;
    await user.save();

    await sendOTPEmail(email, otp);
    res.status(200).json({ message: 'OTP sent to your email. Please verify.' });

  } catch (error) {
    console.error('Generate OTP Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.otp || !user.otpExpires) {
      return res.status(400).json({ message: 'Invalid request. Please try again.' });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
    }

    const isMatch = await bcrypt.compare(otp, user.otp);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid OTP.' });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      { expiresIn: '3h' },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ message: 'Login successful.', token });
      }
    );
  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};