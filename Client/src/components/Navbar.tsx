import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom"; // Import useLocation to detect current route
import { Button } from "@/components/ui/button";
import { BarChart3, Menu, X } from "lucide-react";
import { cn } from '@/lib/utils';
import logo from '../logo/logo.png'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation(); // Hook to get current route

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Check if we're on the homepage
  const isHomePage = location.pathname === '/';

  // Navigation items array for reusability
  const navItems = [
    { label: 'Features', href: '#features', to: '/' },
    { label: 'How It Works', href: '#how-it-works', to: '/' },
    { label: 'Testimonials', href: '#testimonials', to: '/' },
    { label: 'Pricing', href: '#pricing', to: '/' },
    { label: 'News', href: null, to: '/news' },
  ];

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 py-4 px-4 md:px-8",
      scrolled ? "bg-background/90 backdrop-blur-lg shadow-md" : "bg-transparent"
    )}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* <BarChart3 className="h-6 w-6 text-primary" /> */}
          <img src={logo} alt="Logo" className="h-10 w-14"/>
          <span className="font-display text-xl font-medium">StockSage</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            item.href && isHomePage ? (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.href ? `${item.to}${item.href}` : item.to}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            )
          ))}
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          {isLoggedIn ? (
            <Button size="sm" className="bg-primary hover:bg-primary/90" asChild>
              <Link to="/dashboard">Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button size="sm" className="bg-primary hover:bg-primary/90" asChild>
                <Link to="/free-analysis">Get Started</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-lg shadow-lg py-4 px-6 flex flex-col space-y-4 animate-fade-in border-t border-border">
          {navItems.map((item) => (
            item.href && isHomePage ? (
              <a
                key={item.label}
                href={item.href}
                className="text-foreground/80 hover:text-primary py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.label}
                to={item.href ? `${item.to}${item.href}` : item.to}
                className="text-foreground/80 hover:text-primary py-2 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            )
          ))}
          <div className="flex flex-col space-y-2 pt-2 border-t border-border">
            {isLoggedIn ? (
              <Button size="sm" className="w-full justify-center bg-primary hover:bg-primary/90" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm" className="w-full justify-center" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button size="sm" className="w-full justify-center bg-primary hover:bg-primary/90" asChild>
                  <Link to="/free-analysis">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;