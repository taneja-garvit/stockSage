import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Search, CheckCircle, Loader2, ChevronDown, ChevronUp } from "lucide-react";
import nseStocks from './nse.json';

const stockList = Object.entries(nseStocks).map(([name, symbol]) => ({
  symbol,
  name
}));

const StockSelector = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState<{ symbol: string; name: string } | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null); // direct JSON object
  const [loading, setLoading] = useState(false);
  const [showAllStocks, setShowAllStocks] = useState(false);
  const { toast } = useToast();

  const filteredStocks = stockList.filter(stock => 
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedStocks = searchQuery.length > 0 
    ? filteredStocks 
    : (showAllStocks ? stockList : stockList.slice(0, 5));

  const handleStockSelect = (stock: { symbol: string; name: string }) => {
    setSelectedStock(stock);
    setAnalysisResult(null);
    setSearchQuery('');
  };
  
  const backend = import.meta.env.VITE_BACKEND;

  const handleAnalyzeStock = async () => {
    if (!selectedStock) return;
    
    setLoading(true);
    setAnalysisResult(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication required');
      }
      
      const response = await fetch(`${backend}/query`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          stock_name: selectedStock.symbol
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze stock');
      }
      
      // Directly use structured JSON from backend
      setAnalysisResult(data.data.analysis_result);
      
      toast({
        title: "Analysis complete",
        description: `You have ${data.data.remaining_tokens} tokens remaining`,
      });
    } catch (error) {
      console.error('Analysis error:', error);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for a stock by name or symbol..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {searchQuery.length > 0 && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="divide-y divide-border max-h-96 overflow-y-auto">
              {filteredStocks.length > 0 ? (
                filteredStocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/50"
                    onClick={() => handleStockSelect(stock)}
                  >
                    <div>
                      <div className="font-medium">{stock.symbol}</div>
                      <div className="text-sm text-muted-foreground">{stock.name}</div>
                    </div>
                    {selectedStock?.symbol === stock.symbol && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center p-4">
                  <p className="text-muted-foreground">No stocks found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {!searchQuery.length && !selectedStock && (
        <div className="space-y-4">
          <div className="mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">NSE Stocks</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedStocks.map((stock) => (
              <div
                key={stock.symbol}
                className="border rounded-lg p-4 cursor-pointer hover:border-primary hover:bg-secondary/20 transition-colors"
                onClick={() => handleStockSelect(stock)}
              >
                <div className="font-medium">{stock.symbol}</div>
                <div className="text-sm text-muted-foreground">{stock.name}</div>
              </div>
            ))}
          </div>
          {stockList.length > 5 && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowAllStocks(!showAllStocks)}
            >
              {showAllStocks ? (
                <>
                  Show Less <ChevronUp className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Show More <ChevronDown className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      )}
      
      {selectedStock && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">{selectedStock.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedStock.symbol}</p>
            </div>
            <Button
              onClick={() => setSelectedStock(null)}
              variant="ghost"
              size="sm"
            >
              Change
            </Button>
          </div>
          
          <Button 
            onClick={handleAnalyzeStock} 
            disabled={loading} 
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>Analyze Stock (100 Tokens)</>
            )}
          </Button>
          
          {analysisResult && (
            <Card className="mt-4 bg-[#1a2b3d] text-white border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="text-lg font-semibold">{analysisResult.stockSymbol}</h4>
                    <p className="text-sm text-gray-400">{analysisResult.analysisDate}</p>
                  </div>
                  <p className="text-xl font-bold">{analysisResult.currentPrice}</p>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-300">Target Price</p>
                    <p className="text-lg font-semibold text-blue-400">{analysisResult.targetPrice}</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-300">Support Price</p>
                    <p className="text-lg font-semibold text-red-400">{analysisResult.supportPrice}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-300">Recommendation</p>
                    <p className="text-lg font-semibold">{analysisResult.recommendation}</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-sm text-gray-300">Time Frame</p>
                    <p className="text-lg font-semibold">{analysisResult.timeFrame}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <h5 className="text-sm font-semibold mb-2">Analysis Summary</h5>
                  <p className="text-sm text-gray-300">{analysisResult.rationale}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default StockSelector;
