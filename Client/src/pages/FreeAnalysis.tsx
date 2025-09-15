import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Search, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import nseStocks from '../components/nse.json';

// Convert nseStocks object into an array
const allStocks = Object.entries(nseStocks).map(([name, symbol]) => ({
  symbol,
  name
}));

// Select only a few stocks to show initially (first 6)
const initialPopularStocks = allStocks.slice(0, 6);

const FreeAnalysis = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState<{ symbol: string; name: string } | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null); // Holds parsed data
  const [loading, setLoading] = useState(false);
  const [requestsRemaining, setRequestsRemaining] = useState(5);
  const { toast } = useToast();

  // Load remaining requests from localStorage on component mount
  useEffect(() => {
    const remaining = localStorage.getItem('freeRequestsRemaining');
    if (remaining !== null) {
      setRequestsRemaining(parseInt(remaining));
    } else {
      localStorage.setItem('freeRequestsRemaining', '5');
    }
  }, []);

  // Filter stocks based on search query
  const filteredStocks = searchQuery.length > 0
    ? allStocks.filter(stock => 
        stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
        stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : initialPopularStocks;

  const handleStockSelect = (stock: { symbol: string; name: string }) => {
    setSelectedStock(stock);
    setAnalysisResult(null);
    setSearchQuery('');
  };

  const backend = import.meta.env.VITE_BACKEND || 'http://localhost:3000';

  const handleAnalyzeStock = async () => {
    if (!selectedStock) return;
    
    if (requestsRemaining <= 0) {
      toast({
        title: "Request limit reached",
        description: "Please sign up to analyze more stocks",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    setAnalysisResult(null);
    
    try {
      const response = await fetch(`${backend}/free-query`, {
        method: 'POST',
        headers: {
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
      
      const newRemainingRequests = requestsRemaining - 1;
      setRequestsRemaining(newRemainingRequests);
      localStorage.setItem('freeRequestsRemaining', newRemainingRequests.toString());
      
      toast({
        title: "Analysis complete",
        description: `You have ${newRemainingRequests} free requests remaining`,
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-4">Free Stock Analysis</h1>
            <p className="text-gray-300 mb-6">Try our AI-powered stock analysis without signing up. You have {requestsRemaining} free requests remaining.</p>
            {requestsRemaining <= 2 && (
              <div className="bg-[#2d3748] rounded-lg p-4 flex gap-3 items-center mb-6">
                <AlertCircle className="h-5 w-5 text-yellow-400" />
                <p className="text-sm">
                  Running low on free requests! <Link to="/signup" className="text-primary hover:underline font-medium">Sign up</Link> for unlimited analyses.
                </p>
              </div>
            )}
          </div>
          
          <div className="space-y-6 bg-gray-800 bg-opacity-60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search for a stock by name or symbol..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            {searchQuery.length > 0 && (
              <Card className="overflow-hidden bg-gray-700 border-gray-600 max-h-64 overflow-y-auto">
                <CardContent className="p-0">
                  <div className="divide-y divide-gray-600">
                    {filteredStocks.length > 0 ? (
                      filteredStocks.map((stock) => (
                        <div
                          key={stock.symbol}
                          className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-600"
                          onClick={() => handleStockSelect(stock)}
                        >
                          <div>
                            <div className="font-medium text-white">{stock.symbol}</div>
                            <div className="text-sm text-gray-300">{stock.name}</div>
                          </div>
                          {selectedStock?.symbol === stock.symbol && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center p-4">
                        <p className="text-gray-300">No stocks found</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {!searchQuery.length && !selectedStock && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-full mb-2">
                  <h3 className="text-sm font-medium text-gray-300">Popular Stocks</h3>
                </div>
                {initialPopularStocks.map((stock) => (
                  <div
                    key={stock.symbol}
                    className="border border-gray-600 rounded-lg p-4 cursor-pointer hover:border-primary hover:bg-gray-700 transition-colors"
                    onClick={() => handleStockSelect(stock)}
                  >
                    <div className="font-medium">{stock.symbol}</div>
                    <div className="text-sm text-gray-300">{stock.name}</div>
                  </div>
                ))}
              </div>
            )}
            
            {selectedStock && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{selectedStock.name}</h3>
                    <p className="text-sm text-gray-300">{selectedStock.symbol}</p>
                  </div>
                  <Button
                    onClick={() => setSelectedStock(null)}
                    variant="ghost"
                    size="sm"
                    className="text-gray-300 hover:text-white"
                  >
                    Change
                  </Button>
                </div>
                
                <Button 
                  onClick={handleAnalyzeStock} 
                  disabled={loading || requestsRemaining <= 0} 
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing...
                    </>
                  ) : requestsRemaining <= 0 ? (
                    <>No free requests remaining</>
                  ) : (
                    <>Free Analysis ({requestsRemaining} left)</>
                  )}
                </Button>
                
                {requestsRemaining <= 0 && !analysisResult && (
                  <div className="text-center mt-6">
                    <p className="text-sm text-gray-300 mb-3">No free requests remaining</p>
                    <Link to="/signup">
                      <Button variant="outline" className="text-primary border-primary hover:bg-primary/10">
                        Sign Up for Full Access
                      </Button>
                    </Link>
                  </div>
                )}
                
                {analysisResult && (
                  <Card className="mt-4 bg-[#1a2b3d] text-white border-none shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="text-lg font-semibold">NSE: {analysisResult.stockSymbol}</h4>
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
            
            <div className="border-t border-gray-600 pt-6 mt-8">
              <p className="text-sm text-gray-300 mb-4">
                Want unlimited stock analyses and personalized recommendations?
              </p>
              <div className="flex gap-4">
                <Link to="/signup" className="flex-1">
                  <Button className="w-full">Sign Up</Button>
                </Link>
                <Link to="/login" className="flex-1">
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreeAnalysis;