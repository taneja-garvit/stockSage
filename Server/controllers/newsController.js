import https from 'https';  
import { Router } from 'express';  

const getNews=async(req,res)=>{
    const page = req.query.page || 1;
    const symbols = [
        'HDFCBANK', 'ICICIBANK', 'SBIN', 'AXISBANK', 'KOTAKBANK', 'BAJFINANCE', 'BAJAJFINSV', 'INDUSINDBK', 'PNB', 'BANKBARODA',
        'YESBANK', 'LICHSGFIN', 'CHOLAFIN', 'PFC', 'RECLTD', 'TCS', 'INFY', 'WIPRO', 'HCLTECH', 'TECHM',
        'LTIM', 'MINDTREE', 'MPHASIS', 'COFORGE', 'PERSISTENT', 'RELIANCE', 'ONGC', 'BPCL', 'HPCL', 'IOC',
        'GAIL', 'ADANIGREEN', 'ADANIPOWER', 'TATAPOWER', 'NTPC', 'TATAMOTORS', 'M%26M', 'BAJAJ-AUTO', 'HEROMOTOCO', 'EICHERMOT',
        'ASHOKLEY', 'TVSMOTOR', 'MARUTI', 'OLAELECTRIC', 'ESCORTS', 'SUNPHARMA', 'DRREDDY', 'CIPLA', 'AUROPHARMA', 'LUPIN',
        'ZYDUSLIFE', 'DIVISLAB', 'BIOCON', 'GLENMARK', 'ALKEM', 'HINDUNILVR', 'ITC', 'NESTLEIND', 'BRITANNIA', 'DABUR',
        'GODREJCP', 'MARICO', 'COLPAL', 'TATACONSUM', 'EMAMILTD', 'LT', 'GMRINFRA', 'ADANIPORTS', 'IRB', 'NCC',
        'PNCINFRA', 'KEC', 'RVNL', 'RITES', 'IRCON', 'TATASTEEL', 'JSWSTEEL', 'HINDALCO', 'VEDL', 'SAIL',
        'NMDC', 'COALINDIA', 'HINDZINC', 'JINDALSTEL', 'APLAPOLLO', 'BHARTIARTL', 'IDEA', 'JIOFIN', 'ZEEL', 'SUNTV',
        'PVRINOX', 'DISHTV', 'NETWORK18', 'JUSTDIAL', 'NAZARA', 'TRENT', 'ADANIENT', 'AWL', 'TITAN', 'KALYANKJIL',
        'VEDANTFASH', 'RAYMOND', 'ABFRL', 'DMART', 'PAGEIND', 'PIDILITIND', 'HAVELLS', 'BERGEPAINT', 'ASIANPAINT', 'ULTRACEMCO',
        'GRASIM', 'AMBUJACEM', 'ACC', 'SHREECEM', 'POLYCAB'
    ].join('%2C');

    const options = {
        hostname: 'api.marketaux.com',
        port: 443,
        path: `/v1/news/all?symbols=${symbols}&filter_entities=true&language=en&limit=10&page=${page}&api_token=P6kyAmrbqG7hPTjfjfYEPHYtmmwXb5jKGusSfOuQ`,
        method: 'GET'
    };

    const request = https.request(options, (response) => {
        let data = '';
        response.on('data', (chunk) => { data += chunk; });
        response.on('end', () => {
            try {
                const jsonData = JSON.parse(data);
                console.log('API Response:', jsonData); // Log the full response
                console.log('Number of articles returned:', jsonData.data ? jsonData.data.length : 0);
                res.json(jsonData);
            } catch (error) {
                console.error('Parse Error:', error);
                res.status(500).json({ error: 'Failed to parse API response' });
            }
        });
    });

    request.on('error', (error) => {
        console.error('Request Error:', error);
        res.status(500).json({ error: error.message });
    });

    request.end();
}
export default getNews;