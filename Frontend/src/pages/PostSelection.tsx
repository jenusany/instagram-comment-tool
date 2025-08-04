import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Image, Video, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PostSelectionProps {
  imageArray: string[];
  videoArray: string[];
  commentJSON: Record<string, any>;
  loading: boolean;
  onSelectPost: (url: string, comments: Record<string, any>) => void;
  onBack: () => void;
}

const PostSelection: React.FC<PostSelectionProps> = ({ 
  imageArray, 
  videoArray, 
  commentJSON,
  loading,
  onSelectPost,
  onBack
}) => {
  const navigate = useNavigate();

  const handlePostSelection = (url: string) => {
    onSelectPost(url, commentJSON);
    navigate('/analysis');
  };

  const handleBack = () => {
    onBack();
    navigate('/facebook-accounts');
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Image className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-4">Loading Instagram Posts</h2>
          <div className="loading-dots justify-center">
            <div className="loading-dot" style={{ '--delay': '0s' } as React.CSSProperties}></div>
            <div className="loading-dot" style={{ '--delay': '0.2s' } as React.CSSProperties}></div>
            <div className="loading-dot" style={{ '--delay': '0.4s' } as React.CSSProperties}></div>
          </div>
        </div>
      </div>
    );
  }

  const allPosts = [
    ...imageArray.map(url => ({ url, type: 'image' })),
    ...videoArray.map(url => ({ url, type: 'video' }))
  ];

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
          <h1 className="text-xl font-semibold">Select Post to Analyze</h1>
          <div className="w-16" /> {/* Spacer */}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Title Section */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-3xl mb-6">
            <Image className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Choose a Post</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Select an Instagram post to analyze its comments and engagement
          </p>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allPosts.map((post, index) => {
            const postData = commentJSON[post.url];
            const likeCount = postData ? postData[1] : 0;
            const timestamp = postData ? postData[2] : '';
            
            return (
              <Card 
                key={index}
                className="card-elegant overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-medium hover:scale-[1.02] animate-slide-up group"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => handlePostSelection(post.url)}
              >
                {/* Media */}
                <div className="aspect-square relative overflow-hidden rounded-t-3xl">
                  {post.type === 'image' ? (
                    <img 
                      src={post.url} 
                      alt="Instagram post"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <video 
                      src={post.url}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      muted
                    />
                  )}
                  
                  {/* Media Type Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className={`${post.type === 'video' ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white border-0`}>
                      {post.type === 'video' ? (
                        <Video className="w-3 h-3 mr-1" />
                      ) : (
                        <Image className="w-3 h-3 mr-1" />
                      )}
                      {post.type}
                    </Badge>
                  </div>
                </div>

                {/* Post Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Heart className="w-4 h-4" />
                      <span className="font-medium">{likeCount.toLocaleString()}</span>
                    </div>
                    {timestamp && (
                      <span className="text-sm text-muted-foreground">
                        {formatDate(timestamp)}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {allPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-muted rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Image className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Posts Found</h3>
            <p className="text-muted-foreground">
              This Instagram Business Account has no posts to analyze.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostSelection;