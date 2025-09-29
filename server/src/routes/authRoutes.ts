import { Router } from 'express';
import { login, sendOtp, signup } from '../controllers/authController.js';

const router = Router();

router.post('/sendotp', sendOtp);
router.post('/signup', signup);
router.post('/login',login);

export default router;