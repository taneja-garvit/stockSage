
import React, { useEffect } from 'react';
import { 
  BarChart3,
  BrainCircuit, 
  LineChart, 
  ArrowRight, 
  PhoneCall, 
  IndianRupee
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const HowItWorks = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );
    
    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));
    
    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  const steps = [
    {
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
      title: "Market Data Collection",
      description: "Our system gathers data from NSE, BSE, financial news, and social media to provide insights relevant to Indian markets.",
    },
    {
      icon: <BrainCircuit className="h-6 w-6 text-primary" />,
      title: "AI Analysis",
      description: "Our algorithms analyze patterns, trends, volumes, and news sentiment to identify potential opportunities.",
    },
    {
      icon: <LineChart className="h-6 w-6 text-primary" />,
      title: "Recommendation Generation",
      description: "AI generates high-confidence recommendations with specific entry points, targets, helping you explore potential market movements for NSE and BSE stocks.",
    },
    {
      icon: <PhoneCall className="h-6 w-6 text-primary" />,
      title: "Insight Visualization",
      description: "Our platform visualizes insights through charts and summaries, helping you understand market trends and sentiment for stocks.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 relative bg-black/30">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 z-[-1]"></div>
      
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 max-w-2xl mx-auto animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">How StockSage Works</h2>
          <p className="text-foreground/70">From data collection to actionable recommendations, our AI-powered platform handles the complex analysis so you don't have to.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-12 order-2 lg:order-1">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="flex gap-5 animate-on-scroll"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    {step.icon}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="absolute top-12 left-1/2 transform -translate-x-1/2 w-0.5 h-12 bg-primary/20"></div>
                  )}
                </div>
                <div className="flex-1 pt-1.5">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-foreground/70 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
            
            <div className="pt-4 animate-on-scroll" style={{ transitionDelay: `400ms` }}>
              <Button size="lg" className="bg-primary hover:bg-primary/90 group">
                Start Trading Smarter
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
          
          <div className="relative animate-on-scroll order-1 lg:order-2">
          <p className='text-[10px] text-gray-500'>*This is an example display intended for demonstration purposes and is not a recommendation or financial advice.</p>
            <div className="glass-card rounded-2xl p-1.5 shadow-2xl overflow-hidden">
              <div className="relative bg-gradient-to-b from-[#0c1220] to-[#0a0f1a] rounded-xl px-4 py-6 aspect-square">
                <div className="absolute inset-0 overflow-hidden rounded-xl">
                  <div className="absolute w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/5 rounded-full"></div>
                  <div className="absolute w-[300px] h-[300px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/5 rounded-full"></div>
                  <div className="absolute w-[200px] h-[200px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/10 rounded-full"></div>
                </div>
                
                <div className="relative z-10">
                  <div className="mb-8 flex justify-between items-center">
                    <div>
                      <div className="text-sm text-foreground/60">NSE: TATASTEEL</div>
                      <div className="text-xl font-semibold">Tata Steel Ltd*</div>
                    </div>
                    <div className="flex items-center">
                      <IndianRupee className="h-4 w-4 mr-1" />
                      <span className="text-xl font-medium">142.85</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="glass-card rounded-lg p-3">
                      <div className="text-xs text-foreground/60 mb-1">Target Price</div>
                      <div className="text-market-bull font-semibold flex items-center">
                        <IndianRupee className="h-3 w-3 mr-1" />
                        <span>165.00</span>
                      </div>
                    </div>
                    <div className="glass-card rounded-lg p-3">
                      <div className="text-xs text-foreground/60 mb-1">Stop Loss</div>
                      <div className="text-market-bear font-semibold flex items-center">
                        <IndianRupee className="h-3 w-3 mr-1" />
                        <span>132.50</span>
                      </div>
                    </div>
                    <div className="glass-card rounded-lg p-3">
                      <div className="text-xs text-foreground/60 mb-1">Risk/Reward</div>
                      <div className="font-semibold">1:2.5</div>
                    </div>
                    <div className="glass-card rounded-lg p-3">
                      <div className="text-xs text-foreground/60 mb-1">Time Frame</div>
                      <div className="font-semibold">2-4 Weeks</div>
                    </div>
                  </div>
                  
                  <div className="glass-card rounded-lg p-4 mb-6">
                    <div className="text-sm font-medium mb-2">Analysis Summary</div>
                    <div className="text-xs text-foreground/80 leading-relaxed">
                      Strong bullish momentum detected with increased volumes. Ascending triangle pattern formed with resistance at ₹145. Recent positive news about steel demand and falling input costs. MACD showing bullish crossover.
                    </div>
                  </div>
                  
                  <div className="glass-card rounded-lg p-4">
                    <div className="text-sm font-medium mb-3">Key Technical Indicators</div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-foreground/70">RSI (14)</span>
                        <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="w-[60%] h-full bg-primary rounded-full"></div>
                        </div>
                        <span className="text-xs font-medium">60</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-foreground/70">MACD</span>
                        <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="w-[70%] h-full bg-market-bull rounded-full"></div>
                        </div>
                        <span className="text-xs font-medium text-market-bull">Bullish</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-foreground/70">Volume</span>
                        <div className="w-32 h-2 bg-white/10 rounded-full overflow-hidden">
                          <div className="w-[85%] h-full bg-primary rounded-full"></div>
                        </div>
                        <span className="text-xs font-medium">+85%</span>
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
    </section>
  );
};

export default HowItWorks;
