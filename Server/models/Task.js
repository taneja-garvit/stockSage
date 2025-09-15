import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    task_type: { type: String, required: true },
    description: { type: String, required: true },
    verification_status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    tokens_awarded: { type: Number, default: 0 }
});

export default mongoose.model('Task', taskSchema);