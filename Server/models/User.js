import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    token_balance: { type: Number, default: 500 },
    referral_code: { type: String, unique: true },
    referred_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
});

export default mongoose.model('User', userSchema);