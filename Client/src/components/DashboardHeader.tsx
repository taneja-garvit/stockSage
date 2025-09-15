import React from 'react';
import { Button } from "@/components/ui/button";
import { BarChart3, LogOut, User } from "lucide-react";

interface ProfileData {
  email: string;
  token_balance: number;
  referral_code: string;
}

interface DashboardHeaderProps {
  profile: ProfileData | null;
  onLogout: () => void;
}

const DashboardHeader = ({ profile, onLogout }: DashboardHeaderProps) => {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-primary" />
          <span className="font-display text-xl font-medium">StockSage</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{profile?.email}</span>
          </div>
          
          <Button variant="ghost" size="sm" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
