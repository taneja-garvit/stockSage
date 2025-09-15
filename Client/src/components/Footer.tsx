
import React from 'react';
import { BarChart3, Mail, Phone, MapPin, Instagram, Twitter, Linkedin, Facebook } from 'lucide-react';
import { cn } from '@/lib/utils';

const Footer = () => {
  return (
    <footer className="bg-background pt-16 pb-8 px-4 border-t border-white/10">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
              <span className="font-display text-xl font-medium">StockSage</span>
            </div>
            <p className="text-sm text-foreground/70 mb-6">
              AI-powered stock recommendations and analysis for Indian markets. Make smarter trading decisions with advanced technology.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-foreground/70 hover:text-primary transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-foreground/70 hover:text-primary text-sm transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-primary text-sm transition-colors">Careers</a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-primary text-sm transition-colors">Press Kit</a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-primary text-sm transition-colors">Investors</a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-primary text-sm transition-colors">Blog</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-foreground/70 hover:text-primary text-sm transition-colors">Documentation</a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-primary text-sm transition-colors">Market Insights</a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-primary text-sm transition-colors">Learning Center</a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-primary text-sm transition-colors">API Reference</a>
              </li>
              <li>
                <a href="#" className="text-foreground/70 hover:text-primary text-sm transition-colors">Community</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-0.5" />
                <span className="text-sm text-foreground/70">support@stocksage.in</span>
              </li>
              {/* <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5" />
                <span className="text-sm text-foreground/70">+91 93845 67890</span>
              </li> */}
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <span className="text-sm text-foreground/70">
                 Delhi, India
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-foreground/60">
            © 2025 StockSage. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-sm text-foreground/60 hover:text-primary transition-colors">Disclaimer</a>
          </div>
        </div>
        
        <div className="mt-6 text-xs text-center text-foreground/50 max-w-3xl mx-auto">
          <p>
            StockSage is not registered with SEBI as a Research Analyst. Trading in financial markets carries risk. Past performance is not indicative of future results. Always conduct your own research and seek professional financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;