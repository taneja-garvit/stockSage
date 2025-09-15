// pages/ForgotPassword.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const backend = import.meta.env.VITE_BACKEND;

  // Validation regex patterns
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  // Validation functions
  const validateEmail = (email: string) => {
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return passwordRegex.test(password);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!otpSent) {
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

      try {
        const response = await fetch(`${backend}/forgot-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to send OTP');
        }

        setOtpSent(true);
        toast({
          title: "OTP Sent",
          description: "Please check your email for the verification code",
        });
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

    // Validate OTP and new password
    const otp = (e.target as any).otp.value;
    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (!newPassword) {
      toast({
        title: "Validation Error",
        description: "New password is required",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    if (!validatePassword(newPassword)) {
      toast({
        title: "Validation Error",
        description: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${backend}/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Password reset failed');
      }

      toast({
        title: "Success!",
        description: "Your password has been reset successfully",
      });

      setTimeout(() => navigate('/login'), 1500);
    } catch (error) {
      toast({
        title: "Reset Failed",
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
            <Link to="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-bold">Reset Password</h1>
              <p className="text-muted-foreground">Enter your email to reset your password</p>
            </div>
            
            <form onSubmit={handleResetPassword} className="space-y-4">
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

              {otpSent && (
                <>
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

                  <div className="space-y-2">
                    <label htmlFor="newPassword" className="text-sm font-medium">New Password</label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className={newPassword && !validatePassword(newPassword) ? "border-red-500" : ""}
                    />
                    {newPassword && !validatePassword(newPassword) && (
                      <p className="text-red-500 text-xs">
                        Password must be 8+ characters with uppercase, lowercase, number, and special character
                      </p>
                    )}
                  </div>
                </>
              )}
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Processing..." : otpSent ? "Reset Password" : "Send OTP"}
              </Button>
            </form>
            
            <div className="text-center text-sm">
              Remember your password?{" "}
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

export default ForgotPassword;