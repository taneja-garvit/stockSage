
import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="glass-card rounded-xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl font-bold text-primary">404</span>
        </div>
        <h1 className="text-3xl font-display font-bold mb-3">Page Not Found</h1>
        <p className="text-foreground/70 mb-6">
          Sorry, we couldn't find the page you're looking for. The URL{" "}
          <span className="text-primary">{location.pathname}</span> may be incorrect or the page
          may have been moved.
        </p>
        <Button className="bg-primary hover:bg-primary/90" onClick={() => window.location.href = "/"}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
