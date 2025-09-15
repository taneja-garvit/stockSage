import React, { useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronRight, TrendingUp, BarChart2, Zap, IndianRupee } from "lucide-react";
import { Link } from 'react-router-dom';

const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-4 overflow-hidden" ref={heroRef}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/50 z-[-2]"></div>

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full filter blur-[100px] animate-pulse-soft z-[-1]"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyan-500/20 rounded-full filter blur-[80px] animate-pulse-soft z-[-1]"></div>

      <div className="container mx-auto max-w-7xl">
        {/* Hero content */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex flex-col max-w-2xl space-y-6 animate-on-scroll animated">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium backdrop-blur-sm">
              <TrendingUp className="w-4 h-4 mr-2" />
              <span>AI-Powered Stock Recommendations</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight">
              Intelligent Stock Analytics for
              <span className="text-gradient"> Indian Markets</span>
            </h1>

            <p className="text-lg text-foreground/80 leading-relaxed">
              Leverage advanced AI to analyze market trends, candlestick patterns, and news sentiment for accurate stock recommendations tailored for Indian investors.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link to="/free-analysis" className="w-full sm:w-auto">
                <Button size="lg" className="bg-primary hover:bg-primary/90 group w-full">
                  Start Trading Smarter
                  <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Learn More
              </Button>
            </div>

            <div className="flex items-center space-x-8 pt-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold">65%</span>
                <span className="text-sm text-foreground/70">Accuracy Rate</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold">₹50Lakh+</span>
                <span className="text-sm text-foreground/70">Data Analyzed</span>
              </div>
              {/* <div className="flex flex-col">
                <span className="text-2xl font-bold">200+</span>
                <span className="text-sm text-foreground/70">Active Users</span>
              </div> */}
              <div className="flex flex-col">
                <span className="text-2xl font-bold">100+</span>
                <span className="text-sm text-foreground/70">Active Learners</span>
              </div>
            </div>
          </div>

          {/* Mockup */}
          <div className="relative w-full max-w-lg animate-on-scroll animated delay-300">
            <p className='text-[10px] text-gray-500'>*This is an example display intended for demonstration purposes</p>
            <div className="glass-card rounded-2xl p-1 shadow-2xl overflow-hidden bg-gradient-to-br from-background/40 to-background/80">
              <div className="relative overflow-hidden rounded-xl w-full aspect-[9/16] max-h-[600px]">
                <div className="absolute inset-0 bg-gradient-to-b from-[#0c1220] to-[#0a0f1a] p-4">
                  {/* Mock UI elements */}
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-semibold">Dashboard</h3>
                      <p className="text-xs text-foreground/60">Monday, 24 July</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <IndianRupee className="h-4 w-4 text-primary" />
                    </div>
                  </div>

                  {/* Market Overview Card */}
                  <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-medium">Market Overview</h4>
                      <span className="text-xs py-1 px-2 rounded-full bg-market-bull/10 text-market-bull">NIFTY +1.2%</span>
                    </div>
                    <div className="h-24 bg-gradient-to-r from-market-bull/10 to-market-bull/5 rounded-lg mb-2 flex items-end p-2">
                      <div className="flex-1 h-[10%] bg-market-bull/30 rounded-sm"></div>
                      <div className="flex-1 h-[30%] bg-market-bull/30 rounded-sm"></div>
                      <div className="flex-1 h-[20%] bg-market-bull/30 rounded-sm"></div>
                      <div className="flex-1 h-[60%] bg-market-bull/30 rounded-sm"></div>
                      <div className="flex-1 h-[40%] bg-market-bull/30 rounded-sm"></div>
                      <div className="flex-1 h-[70%] bg-market-bull/30 rounded-sm"></div>
                      <div className="flex-1 h-[85%] bg-market-bull/30 rounded-sm"></div>
                    </div>
                  </div>

                  {/* Top Recommendation Card */}
                  <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-medium">Top Recommendation</h4>
                      <Zap className="h-4 w-4 text-yellow-400" />
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h5 className="font-medium">Reliance Industries</h5>
                        <span className="text-xs text-foreground/60">NSE: RELIANCE</span>
                      </div>
                      <span className="text-market-bull font-semibold">₹2,890.25</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs py-1 px-2 rounded-full bg-market-bull/10 text-market-bull">
                        +2.5%
                      </span>
                      <span className="text-xs text-foreground/70">Strong Buy</span>
                    </div>
                    <div className="mt-3 flex justify-between items-center">
                      <div className="text-xs">
                        <div className="flex items-center gap-1 text-foreground/60">
                          <span>Target:</span>
                          <span className="text-market-bull">₹3,125.00</span>
                        </div>
                        <div className="flex items-center gap-1 text-foreground/60">
                          <span>Stop Loss:</span>
                          <span className="text-market-bear">₹2,750.00</span>
                        </div>
                      </div>
                      <Button size="sm" className="text-xs h-8 bg-primary hover:bg-primary/90">View Analysis</Button>
                    </div>
                  </div>

                  {/* Other Recommendations */}
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-sm font-medium">Watchlist</h4>
                      <BarChart2 className="h-4 w-4 text-foreground/60" />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">HDFC Bank</span>
                        <span className="text-market-bull text-sm">+1.2%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">TCS</span>
                        <span className="text-market-bear text-sm">-0.5%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Infosys</span>
                        <span className="text-market-bull text-sm">+0.8%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/20 rounded-full filter blur-xl"></div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-blue-400/10 rounded-full filter blur-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
