
import React, { useEffect } from 'react';
import { 
  BarChart3, 
  Newspaper, 
  TrendingUp, 
  LineChart, 
  Bell, 
  CheckCircle2,
  ShieldCheck,
  Clock3
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  delay?: number;
}

const FeatureCard = ({ icon, title, description, className, delay = 0 }: FeatureCardProps) => (
  <div 
    className={cn(
      "glass-card rounded-xl p-6 animate-on-scroll", 
      className
    )}
    style={{ transitionDelay: `${delay}ms` }}
  >
    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-sm text-foreground/70 leading-relaxed">{description}</p>
  </div>
);

const Features = () => {
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

  return (
    <section id="features" className="py-20 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 max-w-2xl mx-auto animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Advanced AI Analysis for Indian Markets</h2>
          <p className="text-foreground/70">Our sophisticated algorithms analyze multiple data points to provide you with accurate and timely stock recommendations.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<BarChart3 className="h-6 w-6 text-primary" />}
            title="Candlestick Pattern Recognition"
            description="Our AI analyzes a range of common candlestick patterns (including Doji, Hammer,totaling up to 20+ identifiable patterns) using historical price data to identify potential trends in Indian stocks."
            delay={100}
          />
          
          <FeatureCard 
            icon={<Newspaper className="h-6 w-6 text-primary" />}
            title="News Sentiment Analysis"
            description="Real-time processing of financial news, social media, and company announcements to gauge market sentiment specific to Indian context."
            delay={200}
          />
          
          <FeatureCard 
            icon={<TrendingUp className="h-6 w-6 text-primary" />}
            title="Technical Indicators"
            description="Comprehensive analysis using RSI, MACD, Moving Averages and other technical indicators tailored for NSE and BSE stocks."
            delay={300}
          />
          
          <FeatureCard 
            icon={<LineChart className="h-6 w-6 text-primary" />}
            title="Volume Analysis"
            description="Our AI tracks volume trends and infers potential institutional or retail activity to highlight possible breakout stocks in Indian markets."
            delay={400}
          />
          
          <FeatureCard 
            icon={<Bell className="h-6 w-6 text-primary" />}
            // title="Real-time Alerts"
            // description="Receive instant notifications when our AI detects high-confidence trading opportunities in your watchlist stocks."
            title="Portfolio Insights"
            description="Gain insights into your portfolio with AI’s analysis of stock trends, helping you understand potential strengths and weaknesses in your NSE and BSE holdings."
            delay={500}
          />
          
          <FeatureCard 
            icon={<CheckCircle2 className="h-6 w-6 text-primary" />}
            title="Risk Assessment"
            description="Our AI provides a risk assessment with basic metrics derived from volatility and trend analysis, helping you evaluate potential risks in your NSE and BSE stock holdings."
            delay={600}
          />
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-xl p-8 animate-on-scroll flex flex-col justify-between h-full" style={{ transitionDelay: `700ms` }}>
            <div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">SEBI Compliant Advice</h3>
              <p className="text-foreground/70 leading-relaxed mb-6">
              Our platform provides AI-powered stock analysis insights, designed for educational and informational purposes. We prioritize transparency in our methodology and aim to empower users with data-driven tools for Indian stocks (NSE/BSE).
              </p>
            </div>
            <ul className="space-y-3">
              {['Open methodology sharing', 'Regular performance updates', 'No financial advisory claims', 'Clear educational intent'].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="glass-card rounded-xl p-8 animate-on-scroll flex flex-col justify-between h-full" style={{ transitionDelay: `800ms` }}>
            <div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Clock3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Market-Specific Timing</h3>
              <p className="text-foreground/70 leading-relaxed mb-6">
                Our AI is specifically calibrated for Indian market hours and trading patterns, accounting for unique aspects of NSE and BSE trading sessions.
              </p>
            </div>
            <ul className="space-y-3">
              {['Trend analysis for potential gap', 'Pattern identification for learning opportunities', 'Trend insights based on historical patterns', 'Long-term trend analysis for informational purposes'].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-foreground/80">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
