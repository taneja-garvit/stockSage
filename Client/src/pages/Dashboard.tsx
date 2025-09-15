
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Wallet, BarChart3, Share2, LogOut, TrendingUp, Search } from "lucide-react";
import DashboardHeader from "@/components/DashboardHeader";
import StockSelector from "@/components/StockSelector";

interface ProfileData {
  email: string;
  token_balance: number;
  referral_code: string;
}

const Dashboard = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_BACKEND;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`${backend}/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Authentication error",
          description: "Please login again",
          variant: "destructive",
        });
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, toast]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate('/login');
  };

  const copyReferralCode = () => {
    if (profile?.referral_code) {
      navigator.clipboard.writeText(profile.referral_code);
      toast({
        title: "Referral code copied!",
        description: "Share with friends to earn tokens",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader profile={profile} onLogout={handleLogout} />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Wallet Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Wallet className="mr-2 h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">{profile?.token_balance} Tokens</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Referral Program</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center mb-2">
                <Share2 className="mr-2 h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Your Referral Code:</span>
              </div>
              <div className="flex items-center gap-2">
                <Input value={profile?.referral_code} readOnly />
                <Button size="sm" onClick={copyReferralCode}>Copy</Button>
              </div>
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">Earn 100 tokens for each friend who signs up</p>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Account Info</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-2">Email:</span>
                  <span>{profile?.email}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-2">Cost per query:</span>
                  <span>100 Tokens</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="stock-analysis">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="stock-analysis">Stock Analysis</TabsTrigger>
            <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stock-analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Stock Analysis</CardTitle>
                <CardDescription>
                  Select a stock to get AI-powered predictions and analysis. Each query costs 100 tokens.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StockSelector />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="watchlist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Watchlist</CardTitle>
                <CardDescription>
                  Stocks you're tracking will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Your watchlist is empty</p>
                  <Button variant="outline" className="mt-4">
                    Add stocks to watchlist
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
