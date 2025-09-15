
import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';
import { Link } from "react-router-dom";

interface TestimonialProps {
  quote: string;
  author: string;
  position: string;
  rating: number;
  className?: string;
  delay?: number;
}

const Testimonial = ({ quote, author, position, rating, className, delay = 0 }: TestimonialProps) => (
  <div 
    className={cn(
      "glass-card rounded-xl p-6 animate-on-scroll", 
      className
    )}
    style={{ transitionDelay: `${delay}ms` }}
  >
    <div className="flex mb-3">
      {Array(5).fill(0).map((_, i) => (
        <Star key={i} className={cn(
          "h-4 w-4 mr-1", 
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
        )} />
      ))}
    </div>
    <p className="text-foreground/80 mb-6 text-sm leading-relaxed italic">"{quote}"</p>
    <div>
      <p className="font-semibold">{author}</p>
      <p className="text-xs text-foreground/60">{position}</p>
    </div>
  </div>
);

const Testimonials = () => {
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

  const testimonials = [
    {
      quote: "StockSage has completely transformed my investment strategy. The AI recommendations are shockingly accurate, and the platform's analysis of Indian market nuances is excellent.",
      author: "Rajesh Sharma",
      position: "Full-time Trader, Mumbai",
      rating: 5,
      delay: 100
    },
    {
      quote: "As someone who trades part-time, StockSage gives me the confidence to make informed decisions quickly. The candlestick pattern recognition is particularly impressive.",
      author: "Priya Patel",
      position: "IT Professional & Investor",
      rating: 5,
      delay: 200
    },
    {
      quote: "The real-time alerts and news sentiment analysis have helped me catch several opportunities I would have otherwise missed. A game-changer for Indian investors.",
      author: "Vikram Singh",
      position: "Portfolio Manager",
      rating: 4,
      delay: 300
    },
    {
      quote: "I've tried several stock analysis tools, but StockSage stands out with its focus on Indian markets. Their risk assessment has saved me from several bad trades.",
      author: "Ananya Desai",
      position: "Retail Investor",
      rating: 5,
      delay: 400
    },
    {
      quote: "The technical analysis provided by StockSage is comprehensive and easy to understand. It's like having a professional analyst in my pocket at all times.",
      author: "Kabir Reddy",
      position: "Financial Consultant",
      rating: 4,
      delay: 500
    },
    {
      quote: "StockSage's recommendations on mid-cap stocks have been particularly profitable. Their AI seems to detect patterns that even experienced traders might miss.",
      author: "Meera Joshi",
      position: "Long-term Investor",
      rating: 5,
      delay: 600
    },
  ];

  return (
    <section id="testimonials" className="py-20 px-4 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16 max-w-2xl mx-auto animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">What Our Users Say</h2>
          <p className="text-foreground/70">Join thousands of satisfied investors who use StockSage to make smarter trading decisions in Indian markets.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Testimonial 
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              position={testimonial.position}
              rating={testimonial.rating}
              delay={testimonial.delay}
            />
          ))}
        </div>
        
        <div className="mt-16 glass-card rounded-xl p-8 animate-on-scroll" style={{ transitionDelay: `700ms` }}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-semibold mb-2">Ready to transform your trading with AI?</h3>
              <p className="text-foreground/70 mb-0 md:mb-0">Join now and make smarter decisions with StockSage.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/login" className="px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-colors">
                Start Free Trial </Link>
             
              {/* <button className="px-6 py-3 rounded-lg border border-primary/30 hover:bg-primary/10 font-medium transition-colors">
                View Demo
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
