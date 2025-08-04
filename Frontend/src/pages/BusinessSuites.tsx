import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Building2, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BusinessSuitesProps {
  suites: string[];
  suiteIds: string[];
  onSelectSuite: (index: number) => void;
}

const BusinessSuites: React.FC<BusinessSuitesProps> = ({ 
  suites, 
  suiteIds, 
  onSelectSuite 
}) => {
  const navigate = useNavigate();

  const handleSuiteSelection = (index: number) => {
    onSelectSuite(index);
    navigate('/facebook-accounts');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="text-foreground hover:bg-accent"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">Select Business Suite</h1>
          <div className="w-16" /> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Title Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/5 rounded-lg mb-6">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Choose Your Business Suite</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Select the Meta Business Suite that contains the Instagram account you want to analyze
          </p>
        </div>

        {/* Business Suites Grid */}
        <div className="grid gap-4 max-w-2xl mx-auto">
          {suites.map((suite, index) => (
            <Card 
              key={index}
              className="card-elegant p-6 cursor-pointer transition-all duration-200 hover:shadow-medium animate-slide-up group"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleSuiteSelection(index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{suite}</h3>
                    <p className="text-muted-foreground">Meta Business Suite</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {suites.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Business Suites Found</h3>
            <p className="text-muted-foreground">
              No Meta Business Suites are associated with this account.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessSuites;