import axios from 'axios';
import User from '../models/User.js';
import StockAnalysis from '../models/Stock.js';

/**
 * Try to extract a JSON object substring from text and parse it.
 * Returns object or null.
 */
function extractJsonFromText(text) {
  if (!text || typeof text !== 'string') return null;
  const first = text.indexOf('{');
  const last = text.lastIndexOf('}');
  if (first === -1 || last === -1 || last <= first) return null;
  const candidate = text.substring(first, last + 1);
  try {
    return JSON.parse(candidate);
  } catch (e) {
    // Try to remove common trailing commas and retry
    const cleaned = candidate.replace(/,\s*}/g, '}').replace(/,\s*\]/g, ']');
    try {
      return JSON.parse(cleaned);
    } catch (e2) {
      return null;
    }
  }
}

/**
 * Fallback parser: extract structured fields from free-text AI response.
 * This is defensive — used when Perplexity doesn't return valid JSON.
 */
function parseTextToStructured(text = '', normalizedStockName = '', today = '') {
  const lower = text.toLowerCase();

  // helper to get the line (or chunk) that mentions a keyword
  const findChunk = (keyword) => {
    const idx = lower.indexOf(keyword.toLowerCase());
    if (idx === -1) return null;
    // return up to next newline or 300 chars
    const chunk = text.slice(idx, Math.min(text.length, idx + 400));
    const newlineIdx = chunk.indexOf('\n');
    return newlineIdx === -1 ? chunk : chunk.slice(0, newlineIdx);
  };

  // stockSymbol
  let stockSymbol = normalizedStockName || '';
  const sym = text.match(/\(NSE:\s*([A-Z0-9\.\-]+)/i);
  if (sym) stockSymbol = sym[1];

  // analysisDate
  const dateMatch = text.match(/as of\s+([A-Za-z0-9:,\s\-()]+)/i);
  let analysisDate = dateMatch ? dateMatch[1].trim() : today;

  // currentPrice
  const cpChunk = findChunk('current stock price') || findChunk('current price') || text;
  const cpMatch = (cpChunk && cpChunk.match(/₹\s*([\d,]+(?:\.\d+)?)/)) || text.match(/Current[:\s]*₹\s*([\d,]+(?:\.\d+)?)/i);
  const currentPrice = cpMatch ? `₹${cpMatch[1].replace(/\s+/g, '')}` : null;

  // targetPrice: look inside target chunk, then fallback to "targets" or first ₹ after "target"
  const tpChunk = findChunk('target price') || findChunk('targets') || text;
  let tpMatch = tpChunk && tpChunk.match(/₹\s*([\d,]+(?:\.\d+)?)/);
  if (!tpMatch) {
    // try "targets ₹123" pattern anywhere
    tpMatch = text.match(/targets?\s*₹\s*([\d,]+(?:\.\d+)?)/i) || text.match(/Target[:\s]*₹\s*([\d,]+(?:\.\d+)?)/i);
  }
  const targetPrice = tpMatch ? `₹${tpMatch[1].replace(/\s+/g, '')}` : null;

  // supportPrice
  const spChunk = findChunk('support') || findChunk('key support') || text;
  const spMatch = (spChunk && spChunk.match(/₹\s*([\d,]+(?:\.\d+)?)/)) || text.match(/support[:\s]*₹\s*([\d,]+(?:\.\d+)?)/i);
  const supportPrice = spMatch ? `₹${spMatch[1].replace(/\s+/g, '')}` : null;

  // recommendation
  let recommendation = null;
  const recChunk = findChunk('recommendation') || text;
  const recMatch = recChunk && recChunk.match(/\b(Buy|Sell|Hold)\b/i);
  if (recMatch) recommendation = recMatch[1].toUpperCase();
  else {
    // fallback: search whole text for the words
    const anyRec = text.match(/\b(Buy|Sell|Hold)\b/i);
    if (anyRec) recommendation = anyRec[1].toUpperCase();
  }

  // timeFrame
  let timeFrame = null;
  const tfMatch = text.match(/Target Price\s*\(([^)]+)\)/i) || text.match(/(\d+\s*(?:-|to)\s*\d+)\s*(months|month)/i);
  if (tfMatch) timeFrame = tfMatch[1].trim();

  // rationale / summary
  let rationale = null;
  const summaryMatch = text.match(/\*\*Summary:\*\*\s*([\s\S]+)/i) || text.match(/Summary[:\s]*([\s\S]+)/i);
  if (summaryMatch) rationale = summaryMatch[1].trim().split('\n')[0].trim();
  else {
    // take a short chunk (first 200 chars) of the AI answer as fallback
    rationale = text.replace(/\s+/g, ' ').trim().slice(0, 300);
  }

  return {
    stockSymbol,
    analysisDate,
    currentPrice,
    targetPrice,
    supportPrice,
    recommendation,
    timeFrame,
    rationale
  };
}

/**
 * Main controller: calls Perplexity, enforces JSON output, parses safely,
 * saves raw text to DB (so schema stays compatible) and returns structured object.
 */
const processQuery = async (req, res) => {
  const { stock_name } = req.body;
  if (!stock_name) {
    return res.status(400).json({ error: 'Stock name is required' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ error: 'User not found' });
    if (user.token_balance < 100) {
      return res.status(400).json({ error: 'Insufficient tokens' });
    }

    // Deduct tokens immediately (same as before)
    user.token_balance -= 100;
    await user.save();
    console.log('User token balance updated:', user.token_balance);

    const normalizedStockName = stock_name.toUpperCase();
    const today = new Date().toISOString().split('T')[0];
    console.log('Querying for stock:', normalizedStockName, 'on date:', today);

    // Check cache (by stock name + date)
    const cachedAnalysis = await StockAnalysis.findOne({
      stock_name: normalizedStockName,
      analysis_date: today
    });

    if (cachedAnalysis) {
      console.log('Returning cached data (will attempt to parse cached text into JSON)');
      const rawCached = cachedAnalysis.analysis_result || ''; // existing string saved
      // Try to extract JSON from cached string, or fallback to structured parse
      let parsedFromCache = extractJsonFromText(rawCached);
      if (!parsedFromCache) {
        parsedFromCache = parseTextToStructured(rawCached, normalizedStockName, today);
      }
      return res.json({
        message: 'Stock query processed successfully (from cache)',
        data: {
          stock_name: normalizedStockName,
          analysis_result: parsedFromCache,
          raw_analysis: rawCached,
          remaining_tokens: user.token_balance
        }
      });
    }

    console.log('No cache found, proceeding with Perplexity API call');

    // Compose a very explicit prompt that asks for JSON ONLY
    const userPrompt = `
Provide a single valid JSON object ONLY (no explanation, no footnotes, no code fences)
for the Indian stock ${normalizedStockName}. The object MUST have these keys:

{
  "stockSymbol": "NSE:<SYMBOL>",
  "analysisDate": "YYYY-MM-DD HH:mm (or YYYY-MM-DD)",
  "currentPrice": "₹<number> (include closing/live note if possible)",
  "targetPrice": "₹<number>",
  "supportPrice": "₹<number>",
  "recommendation": "Buy|Sell|Hold",
  "timeFrame": "3-6 Months (or appropriate)",
  "rationale": "Short 1-2 line reason"
}

Rules:
- Output ONLY a single JSON object (nothing else).
- Do NOT include citations like [1][2].
- If you cannot provide live price, set the price fields to null but keep valid JSON.
- Keep numbers in Indian rupee format (use ₹) and avoid placeholder values like '₹1'.
- Identify yourself is NOT necessary in the JSON output.
`;

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
            content: 'You are a precise financial assistant and must follow the user instructions exactly.'
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_tokens: 400,
        temperature: 0.2
      }
    });

    const rawAnalysis = (response.data?.choices?.[0]?.message?.content || '').trim();
    console.log('Raw Analysis from Perplexity:', rawAnalysis);

    // Attempt 1: Extract JSON substring and parse
    let parsedResult = extractJsonFromText(rawAnalysis);

    // Attempt 2: If not JSON, try to parse plain text into structured object
    if (!parsedResult) {
      parsedResult = parseTextToStructured(rawAnalysis, normalizedStockName, today);
    }

    // Build a string to save (keep backward compatibility)
    const savedAnalysisString = `StockSageAiBot Analysis: ${rawAnalysis.replace(/Perplexity|AI|artificial intelligence/gi, '')}`;

    // Save raw string into DB (preserves original schema shape)
    const newStockAnalysis = new StockAnalysis({
      stock_name: normalizedStockName,
      analysis_date: today,
      analysis_result: savedAnalysisString
    });

    try {
      await newStockAnalysis.save();
      console.log('Stock analysis saved to MongoDB (raw string).');
    } catch (saveError) {
      console.error('Error saving to MongoDB:', saveError);
      // don't throw; we can still return the parsed result to client
    }

    // Finally return the parsed object to frontend (plus raw string as debug)
    return res.json({
      message: 'Stock query processed successfully',
      data: {
        stock_name: normalizedStockName,
        analysis_result: parsedResult,
        raw_analysis: savedAnalysisString,
        remaining_tokens: user.token_balance
      }
    });

  } catch (error) {
    console.error('Query error:', error);
    return res.status(500).json({
      error: 'Stock query failed',
      details: error?.message || 'An unexpected error occurred'
    });
  }
};

// Free query function (no authentication required)
const processFreeQuery = async (req, res) => {
    const { stock_name } = req.body;
    if (!stock_name) {
        return res.status(400).json({ error: 'Stock name is required' });
    }

    try {
        const normalizedStockName = stock_name.toUpperCase();
        const today = new Date().toISOString().split('T')[0];

        // Check cache first
        const cachedAnalysis = await StockAnalysis.findOne({
            stock_name: normalizedStockName,
            analysis_date: today
        });

        if (cachedAnalysis) {
            return res.json({
                message: 'Stock query processed successfully (from cache)',
                data: {
                    stock_name: cachedAnalysis.stock_name,
                    analysis_result: cachedAnalysis.analysis_result
                }
            });
        }

        // Make API call to Perplexity
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
                            1. Current stock price with the exact date and time (specify if it's the closing price from the last session or live during market hours).
                            2. Target price for the next 3-6 months, including the basis for this estimate (e.g., analyst consensus, technical patterns, or fundamentals).
                            3. Key support price level, with an explanation of how it's derived (e.g., technical support, moving averages, or historical lows).
                            4. Recommendation (Buy/Sell/Hold) with a clear rationale based on technical indicators, fundamentals, and market sentiment.
                            Use latest market data of today as available, reflecting NSE/BSE trading sessions (9:15 AM to 3:30 PM IST). If the market is closed, use the most recent closing data and note it accordingly.`
                    }
                ],
                max_tokens: 300,
                temperature: 0.7
            }
        });

        const rawAnalysis = response.data.choices[0].message.content;
        const analysisResult = `StockSageAiBot Analysis: ${rawAnalysis.replace(/Perplexity|AI|artificial intelligence/gi, '')}`;

        // Save to cache
        const newStockAnalysis = new StockAnalysis({
            stock_name: normalizedStockName,
            analysis_date: today,
            analysis_result: analysisResult
        });

        await newStockAnalysis.save();

        res.json({
            message: 'Stock query processed successfully',
            data: {
                stock_name: normalizedStockName,
                analysis_result: analysisResult
            }
        });

    } catch (error) {
        console.error('Free query error:', error);
        res.status(500).json({
            error: 'Stock query failed',
            details: error?.message || 'An unexpected error occurred'
        });
    }
};

export { processQuery, processFreeQuery };
