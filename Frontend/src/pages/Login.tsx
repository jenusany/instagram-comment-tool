import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Instagram, Facebook } from "lucide-react";

interface LoginProps {
  onLogin: (e: React.FormEvent) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-muted rounded-3xl mb-6">
            <Instagram className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-2">InstaAnalyzer</h1>
          <p className="text-muted-foreground text-lg">Analyze your Instagram posts with AI-powered sentiment analysis</p>
        </div>

        {/* Login Card */}
        <Card className="card-elegant p-8">
          <div className="text-center space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-2">Get Started</h2>
              <p className="text-muted-foreground">Connect your Facebook Business Account to analyze your Instagram posts</p>
            </div>

            <form onSubmit={onLogin} className="space-y-4">
              <Button 
                type="submit" 
                className="bg-[#1877F2] hover:bg-[#166FE5] text-white w-full h-14 text-lg font-medium rounded-md"
              >
                <Facebook className="w-5 h-5 mr-3" />
                Continue with Facebook
              </Button>
            </form>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground leading-relaxed">
                By continuing, you agree to our Terms of Service and Privacy Policy. 
                We'll only access your business account data to provide analytics.
              </p>
            </div>
          </div>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="text-muted-foreground">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-sm">Analytics</p>
          </div>
          <div className="text-muted-foreground">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <p className="text-sm">AI Insights</p>
          </div>
          <div className="text-muted-foreground">
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-sm">Comments</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;