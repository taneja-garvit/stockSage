import mongoose from 'mongoose';

const stockAnalysisSchema = new mongoose.Schema({
    stock_name: { type: String, required: true },
    analysis_date: { type: String, required: true },
    analysis_result: { type: String, required: true },
    created_at: { type: Date, default: Date.now, expires: '24h' }
});
const StockAnalysis = mongoose.model('StockAnalysis', stockAnalysisSchema);
export default StockAnalysis;