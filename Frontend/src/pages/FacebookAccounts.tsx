import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Facebook, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FacebookAccountsProps {
  accounts: string[];
  accountIds: string[];
  loading: boolean;
  onSelectAccount: (index: number) => void;
  onBack: () => void;
}

const FacebookAccounts: React.FC<FacebookAccountsProps> = ({ 
  accounts, 
  accountIds, 
  loading,
  onSelectAccount,
  onBack
}) => {
  const navigate = useNavigate();

  const handleAccountSelection = (index: number) => {
    onSelectAccount(index);
    navigate('/post-selection');
  };

  const handleBack = () => {
    onBack();
    navigate('/business-suites');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/5 rounded-lg flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Facebook className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Loading Facebook Accounts</h2>
          <div className="loading-dots justify-center">
            <div className="loading-dot" style={{ '--delay': '0s' } as React.CSSProperties}></div>
            <div className="loading-dot" style={{ '--delay': '0.2s' } as React.CSSProperties}></div>
            <div className="loading-dot" style={{ '--delay': '0.4s' } as React.CSSProperties}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="text-foreground hover:bg-accent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">Select Facebook Account</h1>
          <div className="w-16" /> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Title Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/5 rounded-lg mb-6">
            <Facebook className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Choose Facebook Business Account</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Select the Facebook Business Account that's connected to your Instagram profile
          </p>
        </div>

        {/* Facebook Accounts Grid */}
        <div className="grid gap-4 max-w-2xl mx-auto">
          {accounts.map((account, index) => (
            <Card 
              key={index}
              className="card-elegant p-6 cursor-pointer transition-all duration-200 hover:shadow-medium animate-slide-up group"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleAccountSelection(index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Facebook className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{account}</h3>
                    <p className="text-muted-foreground">Facebook Business Account</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {accounts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Facebook className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Facebook Accounts Found</h3>
            <p className="text-muted-foreground">
              This Meta Business Suite has no associated Facebook Business Accounts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacebookAccounts;