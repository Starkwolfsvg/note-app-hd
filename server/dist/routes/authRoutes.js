// server/src/routes/authRoutes.ts
import { Router } from 'express';
import { generateOtp, verifyOtp } from '../controllers/authController.js';
import passport from 'passport';
import jwt from 'jsonwebtoken';
const router = Router();
router.post('/generate-otp', generateOtp);
router.post('/verify-otp', verifyOtp);
// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/' }), (req, res) => {
    const payload = { user: { id: req.user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' }, (err, token) => {
        if (err)
            throw err;
        res.json({ token });
    });
});
export default router;
