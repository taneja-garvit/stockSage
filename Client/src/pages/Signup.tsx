import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_BACKEND;

  // Validation regex patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Validation functions
  const validateEmail = (email: string) => emailRegex.test(email);
  const validatePassword = (password: string) => passwordRegex.test(password);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!agreedToTerms) {
      toast({
        title: "Terms Agreement Required",
        description: "Please agree to the Terms & Conditions to proceed",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (!otpSent) {
      if (!email) {
        toast({ title: "Validation Error", description: "Email is required", variant: "destructive" });
        setLoading(false);
        return;
      }

      if (!validateEmail(email)) {
        toast({ title: "Validation Error", description: "Please enter a valid email address", variant: "destructive" });
        setLoading(false);
        return;
      }

      if (!password) {
        toast({ title: "Validation Error", description: "Password is required", variant: "destructive" });
        setLoading(false);
        return;
      }

      if (!validatePassword(password)) {
        toast({
          title: "Validation Error",
          description: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${backend}/register-otp`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to send OTP');

        setOtpSent(true);
        toast({ title: "OTP Sent", description: "Please check your email for the verification code" });
      } catch (error) {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : 'Failed to send OTP',
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
      return;
    }

    const otp = (e.target as any).otp.value;
    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      toast({ title: "Validation Error", description: "Please enter a valid 6-digit OTP", variant: "destructive" });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backend}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, referral_code: referralCode, otp }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');
      localStorage.setItem('token', data.token);
      toast({ title: "Account created!", description: `Your referral code is: ${data.referral_code}` });
      localStorage.setItem('referralCode', data.referral_code);
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
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
              <h1 className="text-3xl font-bold">Create an account</h1>
              <p className="text-muted-foreground">Enter your details to start trading with AI</p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.trim())}
                  required
                  disabled={otpSent}
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
                  disabled={otpSent}
                  className={password && !validatePassword(password) ? "border-red-500" : ""}
                />
                {password && !validatePassword(password) && (
                  <p className="text-red-500 text-xs">
                    Password must be 8+ characters with uppercase, lowercase, number, and special character
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="referral" className="text-sm font-medium">Referral Code (Optional)</label>
                <Input
                  id="referral"
                  type="text"
                  placeholder="Enter referral code"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.trim())}
                  disabled={otpSent}
                />
              </div>

              {otpSent && (
                <div className="space-y-2">
                  <label htmlFor="otp" className="text-sm font-medium">Enter OTP</label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    required
                    maxLength={6}
                    onChange={(e) => e.target.value = e.target.value.replace(/\D/g, '')}
                    className="font-mono"
                  />
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                />
                <label htmlFor="terms" className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  I agree to the{" "}
                  <Dialog>
                    <DialogTrigger asChild>
                      <span className="text-primary hover:underline cursor-pointer">Terms & Conditions</span>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Terms & Conditions</DialogTitle>
                        <DialogDescription>
                          Please read our disclaimer carefully before proceeding.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                          The stock predictions, target values, and buy/sell recommendations provided by our AI system are based on analysis of historical data, news, and market patterns, including candlestick trends. These predictions are not guaranteed to be 100% accurate and should not be considered financial advice and past performance does not guarantee future results. All investments in the stock market carry risk, and users are encouraged to conduct their own research, consult financial advisors before making decisions and make final decisions independently. We are not SEBI-registered, and by using our services, you acknowledge that we are not liable for any financial losses or investment decisions made based on our analysis.
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                </label>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Processing..." : otpSent ? "Verify and Sign Up" : "Send OTP"}
              </Button>
            </form>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-primary hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;