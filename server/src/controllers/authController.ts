import { Request, Response } from 'express';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendEmail } from '../utils/mailer.js';

// Send OTP
export const sendOtp = async (req: Request, res: Response) => {
  try {
    const { email, page } = req.body;
    if (!email || !page) return res.status(400).json({ message: 'Email and page required' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const otpToken = crypto.randomBytes(16).toString('hex');

    let user = await User.findOne({ email });
    if (!user) user = new User({ email, isVerified: false });
    
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 min
    await user.save();

    await sendEmail(email,otp);

    return res.json({ message: 'OTP sent to email.', otpToken });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Signup
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, dob, email, otp } = req.body;
    if (!name || !dob || !email || !otp)
      return res.status(400).json({ message: 'All fields are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'OTP not generated for this email' });

    if (!user.otp || !user.otpExpires)
      return res.status(400).json({ message: 'OTP missing. Please request again.' });

    if (user.otp !== otp) return res.status(400).json({ message: 'Incorrect OTP' });
    if (user.otpExpires < new Date()) return res.status(400).json({ message: 'OTP expired' });

    user.name = name;
    user.dateOfBirth = new Date(dob);
    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    return res.json({ message: 'Signup successful!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error during signup' });
  }
};
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const login = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const user = await User.findOne({ email });
    if (!user || !user.isVerified) return res.status(401).json({ message: "User not found or not verified" });

    if (user.otp !== otp) return res.status(401).json({ message: "Incorrect OTP" });
    if (!user.otpExpires || user.otpExpires < new Date()) return res.status(401).json({ message: "OTP expired" });

    // clear OTP after login
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // generate auth token
    const authToken = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    return res.status(200).json({
      authToken,
      userData: {
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
        notes: user.notes,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};