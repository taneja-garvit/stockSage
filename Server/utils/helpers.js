function extractField(text, fieldName) {
    const regex = new RegExp(`${fieldName}.*?:\\s*([^\\n]+)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : null;
}

function cleanText(text) {
    if (!text || text === 'N/A') return text;
    text = text.replace(/\[\d+\](\[\d+\])?/g, '');
    const priceMatch = text.match(/₹?[\d,]+\.?\d*/);
    if (priceMatch) {
        return `${priceMatch[0]}`;
    }
    return text.trim();
}

const generateReferralCode = () => {
    return 'REF' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

export { extractField, cleanText, generateReferralCode };