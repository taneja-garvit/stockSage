import axios from 'axios';
import User from '../models/User.js';
import StockAnalysis from '../models/Stock.js';

const processQuery = async (req, res) => {
    const { stock_name } = req.body;
    if (!stock_name) {
        return res.status(400).json({ error: 'Stock name is required' });
    }

    try {
        const user = await User.findById(req.user.id);
        if (user.token_balance < 100) {
            return res.status(400).json({ error: 'Insufficient tokens' });
        }

        user.token_balance -= 100;
        await user.save();
        console.log('User token balance updated:', user.token_balance);

        const normalizedStockName = stock_name.toUpperCase();
        const today = new Date().toISOString().split('T')[0];
        console.log('Querying for stock:', normalizedStockName, 'on date:', today);

        const cachedAnalysis = await StockAnalysis.findOne({
            stock_name: normalizedStockName,
            analysis_date: today
        });
        console.log('Cached analysis found:', cachedAnalysis);

        if (cachedAnalysis) {
            console.log('Returning cached data');
            return res.json({
                message: 'Stock query processed successfully (from cache)',
                data: {
                    stock_name: cachedAnalysis.stock_name,
                    analysis_result: cachedAnalysis.analysis_result,
                    remaining_tokens: user.token_balance
                }
            });
        }

        console.log('No cache found, proceeding with API call');

        const response = await axios({
            method: 'post',
            url: 'https://api.perplexity.ai/chat/completions',
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`
            },
            data: {
                model: 'sonar-pro',
                messages: [
                    {
                        role: 'system',
                        content: 'Be precise and concise. Provide data without citation markers like [1][2]. Identify yourself as StockSageAiBot in the response.'
                    },
                    {
                        role: 'user',
                        content: `use max tokens 200,Provide current analysis of current date for Indian stock ${normalizedStockName} with:
                            1. Current stock price with the exact date and time (specify if it’s the closing price from the last session or live during market hours).
                            2. Target price for the next 3-6 months, including the basis for this estimate (e.g., analyst consensus, technical patterns, or fundamentals).
                            3. Key support price level, with an explanation of how it’s derived (e.g., technical support, moving averages, or historical lows).
                            4. Recommendation (Buy/Sell/Hold) with a clear rationale based on technical indicators, fundamentals, and market sentiment.
                            Use latest market data of today as available, reflecting NSE/BSE trading sessions (9:15 AM to 3:30 PM IST). If the market is closed, use the most recent closing data and note it accordingly.`
                    }
                ],
                max_tokens: 300,
                temperature: 0.7
            }
        });

        const rawAnalysis = response.data.choices[0].message.content;
        console.log('Raw Analysis:', rawAnalysis);

        const analysisResult = `StockSageAiBot Analysis: ${rawAnalysis.replace(/Perplexity|AI|artificial intelligence/gi, '')}`;

        const newStockAnalysis = new StockAnalysis({
            stock_name: normalizedStockName,
            analysis_date: today,
            analysis_result: analysisResult
        });

        try {
            await newStockAnalysis.save();
            console.log('Stock analysis saved to MongoDB:', newStockAnalysis);
        } catch (saveError) {
            console.error('Error saving to MongoDB:', saveError);
            throw new Error('Failed to save stock analysis to database');
        }

        res.json({
            message: 'Stock query processed successfully',
            data: {
                stock_name: normalizedStockName,
                analysis_result: analysisResult,
                remaining_tokens: user.token_balance
            }
        });

    } catch (error) {
        console.error('Query error:', error);
        res.status(500).json({
            error: 'Stock query failed',
            details: error.message || 'An unexpected error occurred'
        });
    }
};
export { processQuery };

// const processQuery = async (req, res) => {
//     const { stock_name } = req.body;

//     if (!stock_name) {
//         return res.status(400).json({ error: 'Stock name is required' });
//     }

//     try {
//         const user = await User.findById(req.user.id);
//         if (user.token_balance < 100) {
//             return res.status(400).json({ error: 'Insufficient tokens' });
//         }

//         user.token_balance -= 100;
//         await user.save();

//         const response = await axios({
//             method: 'post',
//             url: 'https://api.perplexity.ai/chat/completions',
//             headers: {
//                 'accept': 'application/json',
//                 'content-type': 'application/json',
//                 'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`
//             },
//             data: {
//                 model: 'sonar-pro',
//                 messages: [
//                     {
//                         role: 'system',
//                         content: 'Be precise and concise. Provide data without citation markers like [1][2].'
//                     },
//                     {
//                         role: 'user',
//                         content: `Provide current analysis for Indian stock ${stock_name} with:
//                             1. Current stock price with the exact date and time (specify if it’s the closing price from the last session or live during market hours).
//                             2. Target price for the next 3-6 months, including the basis for this estimate (e.g., analyst consensus, technical patterns, or fundamentals).
//                             3. Key support price level, with an explanation of how it’s derived (e.g., technical support, moving averages, or historical lows).
//                             4. Recommendation (Buy/Sell/Hold) with a clear rationale based on technical indicators, fundamentals, and market sentiment.
//                             5. Recent performance trend (e.g., percentage change over the last 1 week, 1 month, and 3 months).
//                             6. Key technical indicators (e.g., 50-day and 200-day Moving Averages, RSI, MACD) and their current implications for the stock.
//                             7. Major resistance price level, with an explanation of its significance. Use the latest market data available as of today, reflecting NSE/BSE trading sessions (9:15 AM to 3:30 PM IST). If the market is closed at the time of response, use the most recent closing data and note it accordingly. Include any relevant context from recent news or earnings reports if applicable.
//                             Use latest market data of today as available.`
//                     }
//                 ],
//                 max_tokens: 200,
//                 temperature: 0.7
//             }
//         });

//         const analysis = response.data.choices[0].message.content;

//         const stockData = {
//             stock_name: stock_name,
//             current_price: cleanText(extractField(analysis, 'current stock price') || 'N/A'),
//             date: extractField(analysis, 'date') || new Date().toISOString().split('T')[0],
//             target_price: cleanText(extractField(analysis, 'target price') || 'N/A'),
//             support_price: cleanText(extractField(analysis, 'support price') || 'N/A'),
//             recommendation: cleanText(extractField(analysis, 'recommendation') || 'N/A'),
//             remaining_tokens: user.token_balance
//         };

//         res.json({
//             message: 'Stock query processed successfully',
//             data: stockData
//         });
//     } catch (error) {
//         console.error('Query error:', error);
//         res.status(500).json({
//             error: 'Stock query failed',
//             details: error.response?.data?.error || error.message
//         });
//     }
// };

// export { processQuery };