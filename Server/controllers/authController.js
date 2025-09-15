import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateReferralCode } from '../utils/helpers.js';

const sendOTP = async (req, res) => {
    const { email } = req.body;
    
    try {
        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store OTP temporarily (you can use Redis or memory store)
        // For now, we'll use a simple approach
        global.otpStore = global.otpStore || {};
        global.otpStore[email] = {
            otp: otp,
            expires: Date.now() + 5 * 60 * 1000 // 5 minutes
        };
        
        // Here you would send email with OTP
        // For now, we'll just log it
        console.log(`OTP for ${email}: ${otp}`);
        
        res.json({ message: 'OTP sent successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send OTP' });
    }
};

const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;
    
    try {
        if (!global.otpStore || !global.otpStore[email]) {
            return res.status(400).json({ error: 'OTP not found or expired' });
        }
        
        const storedOTP = global.otpStore[email];
        
        if (Date.now() > storedOTP.expires) {
            delete global.otpStore[email];
            return res.status(400).json({ error: 'OTP expired' });
        }
        
        if (storedOTP.otp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }
        
        // OTP is valid, mark email as verified
        delete global.otpStore[email];
        res.json({ message: 'OTP verified successfully' });
    } catch (error) {
        res.status(500).json({ error: 'OTP verification failed' });
    }
};

const register = async (req, res) => {
    const { email, password, referral_code, otp } = req.body;

    try {
        // if (otp) {
        //     // Verify OTP logic
        // }
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'Email already in use' });

        const password_hash = await bcrypt.hash(password, 10);
        const newReferralCode = generateReferralCode();

        let referred_by = null;
        if (referral_code) {
            const referrer = await User.findOne({ referral_code });
            if (referrer) {
                referred_by = referrer._id;
                referrer.token_balance += 100;
                await referrer.save();
            }
        }

        const user = new User({
            email,
            password_hash,
            referral_code: newReferralCode,
            referred_by
        });

        await user.save();
        
        // Generate token for immediate login
        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.status(201).json({ 
            message: 'User registered successfully', 
            referral_code: newReferralCode,
            token: token
        });
    } catch (error) {
        res.status(500).json({ error: 'Registration failed', details: error.message });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid email or password' });

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ error: 'Login failed', details: error.message });
    }
};

export { register, login,sendOTP, verifyOTP };