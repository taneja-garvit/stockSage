import User from '../models/User.js';
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('email token_balance referral_code');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile', details: error.message });
    }
};

export { getProfile };