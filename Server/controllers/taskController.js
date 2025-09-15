import Task from '../models/Task.js';
import User from '../models/User.js';

const submitTask = async (req, res) => {
    const { task_type, description } = req.body;

    try {
        const task = new Task({
            user_id: req.user.id,
            task_type,
            description
        });

        await task.save();
        res.status(201).json({ message: 'Task submitted successfully', task_id: task._id });
    } catch (error) {
        res.status(500).json({ error: 'Task submission failed', details: error.message });
    }
};

const verifyTask = async (req, res) => {
    const { status, tokens_awarded } = req.body;

    try {
        const task = await Task.findById(req.params.taskId);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        task.verification_status = status;
        if (status === 'approved') {
            task.tokens_awarded = tokens_awarded || 50;
            const user = await User.findById(task.user_id);
            user.token_balance += task.tokens_awarded;
            await user.save();
        }

        await task.save();
        res.json({ message: 'Task verified successfully', task });
    } catch (error) {
        res.status(500).json({ error: 'Task verification failed', details: error.message });
    }
};

export { submitTask, verifyTask };