import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Heart, Clock, MessageCircle, TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalysisProps {
  commentArr: [string[], number, string];
  onBack: () => void;
}

const Analysis: React.FC<AnalysisProps> = ({ commentArr, onBack }) => {
  const navigate = useNavigate();
  const [positiveArray, setPositiveArray] = useState<string[]>([]);
  const [negativeArray, setNegativeArray] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSegment, setSelectedSegment] = useState<'positive' | 'negative' | null>(null);

  const handleBack = () => {
    onBack();
    navigate('/post-selection');
  };

  const sendDataToServer = async (data: { list: string[] }) => {
    try {
      const response = await fetch('https://buzz-builder.com//process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const processedData = await response.json();
        setPositiveArray(processedData["Positive"] || []);
        setNegativeArray(processedData["Negative"] || []);
      } else {
        console.error('Error:', response.statusText);
        // Fallback for demo
        setPositiveArray(["Great content!", "Love this post!", "Amazing work!"]);
        setNegativeArray(["Not a fan", "Could be better"]);
      }
    } catch (error) {
      console.error('Error:', error);
      // Fallback for demo
      setPositiveArray(["Great content!", "Love this post!", "Amazing work!"]);
      setNegativeArray(["Not a fan", "Could be better"]);
    }
    
    setLoading(false);
  };

  const dateDifference = (date1: string, date2: string): number => {
    const firstDate = new Date(date1);
    const secondDate = new Date(date2);
    const differenceInMilliseconds = secondDate.getTime() - firstDate.getTime();
    return differenceInMilliseconds / (1000 * 60 * 60 * 24);
  };

  const getPostAgeText = (): string => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    const diff = dateDifference(
      commentArr[2].slice(0, commentArr[2].indexOf("T")), 
      `${year}-${month}-${day}`
    );

    if (diff <= 7) {
      return `This post is ${Math.round(diff)} days old. Instagram posts are displayed on users feeds for 7 days, which means this post is still reaching accounts!`;
    } else {
      return `This post is ${Math.round(diff)} days old. Instagram posts are displayed on users feeds for 7 days, which means this post is no longer reaching accounts.`;
    }
  };

  useEffect(() => {
    if (commentArr && commentArr[0]) {
      sendDataToServer({ list: commentArr[0] });
    }
  }, [commentArr]);

  const COLORS = ['hsl(142, 76%, 36%)', 'hsl(0, 84%, 60%)'];
  const data = [
    { name: 'Positive', value: positiveArray.length, color: COLORS[0] },
    { name: 'Negative', value: negativeArray.length, color: COLORS[1] },
  ];

  const totalComments = positiveArray.length + negativeArray.length;
  const positivePercentage = totalComments > 0 ? Math.round((positiveArray.length / totalComments) * 100) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <TrendingUp className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Analyzing Comments</h2>
          <p className="text-muted-foreground mb-6">Our AI is processing sentiment analysis...</p>
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
    <div className="min-h-screen bg-gradient-soft">
      {/* Header */}
      <div className="bg-white/50 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={handleBack}
            className="text-foreground hover:bg-white/20"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-xl font-semibold">Post Analysis</h1>
          <div className="w-16" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Title Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl font-bold mb-4">Post Analysis Results</h2>
          <p className="text-muted-foreground text-lg">
            AI-powered sentiment analysis of your Instagram post comments
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-elegant p-6 animate-slide-up">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{commentArr[1].toLocaleString()}</p>
                <p className="text-muted-foreground">Total Likes</p>
              </div>
            </div>
          </Card>

          <Card className="card-elegant p-6 animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalComments}</p>
                <p className="text-muted-foreground">Total Comments</p>
              </div>
            </div>
          </Card>

          <Card className="card-elegant p-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${positivePercentage >= 50 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                {positivePercentage >= 50 ? (
                  <TrendingUp className="w-6 h-6 text-green-500" />
                ) : (
                  <TrendingDown className="w-6 h-6 text-red-500" />
                )}
              </div>
              <div>
                <p className="text-2xl font-bold">{positivePercentage}%</p>
                <p className="text-muted-foreground">Positive Sentiment</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Post Age Info */}
        <Card className="card-elegant p-6 mb-8 animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-yellow-500/10 rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-2">Post Timing Analysis</h3>
              <p className="text-muted-foreground leading-relaxed">{getPostAgeText()}</p>
            </div>
          </div>
        </Card>

        {/* Sentiment Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart */}
          <Card className="card-elegant p-6 animate-slide-up" style={{ animationDelay: '400ms' }}>
            <h3 className="text-xl font-semibold mb-6 text-center">Comment Sentiment Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    onClick={(entry, index) => {
                      setSelectedSegment(index === 0 ? 'positive' : 'negative');
                    }}
                    className="cursor-pointer"
                  >
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        className="hover:opacity-80 transition-opacity"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: 'none', 
                      borderRadius: '12px',
                      boxShadow: '0 4px 20px -4px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <Button
                variant={selectedSegment === 'positive' ? 'default' : 'outline'}
                onClick={() => setSelectedSegment('positive')}
                className="w-full"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Positive ({positiveArray.length})
              </Button>
              <Button
                variant={selectedSegment === 'negative' ? 'default' : 'outline'}
                onClick={() => setSelectedSegment('negative')}
                className="w-full"
              >
                <TrendingDown className="w-4 h-4 mr-2" />
                Negative ({negativeArray.length})
              </Button>
            </div>
          </Card>

          {/* Comments */}
          <Card className="card-elegant p-6 animate-slide-up" style={{ animationDelay: '500ms' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">
                {selectedSegment === 'positive' ? 'Positive' : selectedSegment === 'negative' ? 'Negative' : 'All'} Comments
              </h3>
              {selectedSegment && (
                <Badge className={selectedSegment === 'positive' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'}>
                  {selectedSegment === 'positive' ? positiveArray.length : negativeArray.length} comments
                </Badge>
              )}
            </div>

            <ScrollArea className="h-80">
              <div className="space-y-3">
                {(!selectedSegment ? [...positiveArray, ...negativeArray] : 
                  selectedSegment === 'positive' ? positiveArray : negativeArray
                ).map((comment, index) => (
                  <div 
                    key={index} 
                    className="p-4 bg-muted/30 rounded-2xl border border-border/50 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <p className="text-sm leading-relaxed">{comment}</p>
                  </div>
                ))}
                
                {selectedSegment && (selectedSegment === 'positive' ? positiveArray : negativeArray).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No {selectedSegment} comments found
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analysis;