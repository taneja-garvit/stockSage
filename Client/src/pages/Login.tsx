import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, LogIn } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_BACKEND;

  // Validation regex patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validation functions
  const validateEmail = (email: string) => {
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate inputs before proceeding
    if (!email) {
      toast({
        title: "Validation Error",
        description: "Email is required",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (!password) {
      toast({
        title: "Validation Error",
        description: "Password is required",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backend}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store the token
      localStorage.setItem('token', data.token);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
        variant: "default",
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : 'Invalid email or password',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to home
            </Link>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Welcome back</h1>
              <p className="text-muted-foreground">Enter your credentials to access your account</p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  required
                  className={email && !validateEmail(email) ? "border-red-500" : ""}
                />
                {email && !validateEmail(email) && (
                  <p className="text-red-500 text-xs">Please enter a valid email</p>
                )}
              </div>
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">Password</label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign in <LogIn className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
            
            <div className="text-center text-sm">
              Forgot Password?{" "}
              <Link to="/forgot-password" className="font-medium text-primary hover:underline">
                Reset
              </Link>
            </div>
            
            <div className="text-center text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="font-medium text-primary hover:underline">
                Create an account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;