import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateReferralCode } from '../utils/helpers.js';

 const register = async (req, res) => {
    const { email, password, referral_code } = req.body;

    try {
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
        res.status(201).json({ message: 'User registered successfully', referral_code: newReferralCode });
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

export { register, login };