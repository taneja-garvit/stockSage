import React, { useEffect } from 'react';
import { 
  Check, 
  X, 
  ChevronRight, 
  TrendingUp, 
  BarChart3, 
  Newspaper, 
  Bell 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PlanFeature {
  name: string;
  basic: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
}

interface PricingPlanProps {
  name: string;
  price: string;
  description: string;
  features: string[];
  recommended?: boolean;
  buttonText: string;
  className?: string;
  delay?: number;
}

const PricingPlan = ({ 
  name, 
  price, 
  description, 
  features, 
  recommended = false, 
  buttonText,
  className,
  delay = 0
}: PricingPlanProps) => (
  <div 
    className={cn(
      "glass-card rounded-xl p-8 relative animate-on-scroll",
      recommended ? "border-primary" : "border-white/10",
      className
    )}
    style={{ transitionDelay: `${delay}ms` }}
  >
    {recommended && (
      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-white text-xs font-medium py-1 px-3 rounded-full">
        Most Popular
      </div>
    )}
    <h3 className="text-xl font-semibold mb-2">{name}</h3>
    <div className="mb-4">
      <span className="text-3xl font-bold">{price}</span>
      {price !== 'Custom' && <span className="text-foreground/60 ml-1">/month</span>}
    </div>
    <p className="text-sm text-foreground/70 mb-6">{description}</p>
    
    <ul className="space-y-3 mb-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-start gap-2">
          <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
          <span className="text-sm">{feature}</span>
        </li>
      ))}
    </ul>
    
    <Button 
      className={cn(
        "w-full justify-center",
        recommended ? "bg-primary hover:bg-primary/90" : "border border-primary/30 bg-transparent hover:bg-primary/10"
      )}
    >
      {buttonText}
      <ChevronRight className="ml-1 h-4 w-4" />
    </Button>
  </div>
);

const Pricing = () => {
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

  const features: PlanFeature[] = [
    { name: "Daily stock recommendations", basic: true, pro: true, enterprise: true },
    { name: "Candlestick pattern analysis", basic: true, pro: true, enterprise: true },
    { name: "Basic technical indicators", basic: true, pro: true, enterprise: true },
    { name: "Market news summary", basic: true, pro: true, enterprise: true },
    { name: "Real-time alerts", basic: false, pro: true, enterprise: true },
    { name: "Advanced sentiment analysis", basic: false, pro: true, enterprise: true },
    { name: "Risk assessment tools", basic: false, pro: true, enterprise: true },
    { name: "Watchlist (stocks)", basic: "5", pro: "20", enterprise: "Unlimited" },
    { name: "Historical backtest tools", basic: false, pro: true, enterprise: true },
    { name: "API access", basic: false, pro: false, enterprise: true },
    { name: "Dedicated account manager", basic: false, pro: false, enterprise: true },
    { name: "Custom strategy development", basic: false, pro: false, enterprise: true },
  ];

  return (
    <section id="pricing" className="py-20 px-4 relative bg-black/30">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-background/80 z-[-1]"></div>
      
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 max-w-2xl mx-auto animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-foreground/70">Choose the plan that fits your trading style and investment goals.</p>
        </div>
        <h1 className='flex justify-center text-3xl font-semibold italic'>Plans Coming Soon...Stay tuned!</h1>
        
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PricingPlan 
            name="Basic" 
            price="₹999" 
            description="Essential tools for casual investors and beginners."
            features={[
              "5 daily stock recommendations",
              "Basic technical analysis",
              "Market news summary",
              "End-of-day alerts",
              "5 watchlist stocks"
            ]}
            buttonText="Get Started"
            delay={100}
          />
          
          <PricingPlan 
            name="Pro" 
            price="₹2,499" 
            description="Advanced analysis for serious traders and investors."
            features={[
              "15 daily stock recommendations",
              "Advanced technical analysis",
              "Real-time news sentiment analysis",
              "Intraday alerts and notifications",
              "20 watchlist stocks",
              "Risk assessment tools",
              "Strategy backtesting"
            ]}
            recommended={true}
            buttonText="Start Free Trial"
            delay={200}
          />
          
          <PricingPlan 
            name="Enterprise" 
            price="Custom" 
            description="Tailored solutions for professional traders and institutions."
            features={[
              "Unlimited recommendations",
              "Full API access",
              "Custom alert conditions",
              "Dedicated account manager",
              "Custom strategy development",
              "Priority support",
              "Advanced reporting tools"
            ]}
            buttonText="Contact Sales"
            delay={300}
          />
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-xl p-8 animate-on-scroll" style={{ transitionDelay: `400ms` }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">14-Day Money Back Guarantee</h3>
            </div>
            <p className="text-foreground/70 leading-relaxed mb-0">
              Try StockSage risk-free. If you're not completely satisfied with our service within the first 14 days, we'll refund your subscription fee, no questions asked.
            </p>
          </div>
          
          <div className="glass-card rounded-xl p-8 animate-on-scroll" style={{ transitionDelay: `500ms` }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Bell className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Special Offer</h3>
            </div>
            <p className="text-foreground/70 leading-relaxed mb-4">
              Get an additional month free when you sign up for an annual subscription. Limited time offer!
            </p>
            <Button className="bg-primary hover:bg-primary/90 group">
              Claim Offer
              <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div> */}
         {/* Disclaimer Footer */}
      <footer className="border-t border-border bg-muted/50 py-6 mt-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-sm font-semibold text-muted-foreground mb-2 text-red-600">Disclaimer</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
            The stock predictions, target values, and buy/sell recommendations provided by our AI system are based on analysis of historical data, news, and market patterns, including candlestick trends. These predictions are not guaranteed to be 100% accurate and should not be considered financial advice and past performance does not guarantee future results. All investments in the stock market carry risk, and users are encouraged to conduct their own research, consult financial advisors before making decisions and make final decisions independently. We are not SEBI-registered, and by using our services, you acknowledge that we are not liable for any financial losses or investment decisions made based on our analysis.
            </p>
          </div>
        </div>
      </footer>
      </div>
    </section>
  );
};

export default Pricing;
