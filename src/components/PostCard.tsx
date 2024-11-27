import { Heart, MessageSquare, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { useState } from "react";
import { toast } from "sonner";

interface PostCardProps {
  title: string;
  content: string;
  author: string;
  category: string;
  votes: number;
  comments: number;
  timeAgo: string;
}

export const PostCard = ({
  title,
  content,
  author,
  category,
  votes: initialVotes,
  comments,
  timeAgo,
}: PostCardProps) => {
  const [votes, setVotes] = useState(initialVotes);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = () => {
    if (hasVoted) {
      setVotes((prev) => prev - 1);
      setHasVoted(false);
      toast.info("Vote removed");
    } else {
      setVotes((prev) => prev + 1);
      setHasVoted(true);
      toast.success("Post upvoted!");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title,
        text: content,
        url: window.location.href,
      });
      toast.success("Post shared successfully!");
    } catch (error) {
      toast.info("Copied link to clipboard!");
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleComment = () => {
    toast.info("Coming soon: Comments section!");
  };

  return (
    <Card className="w-full mb-4 overflow-hidden hover:shadow-lg transition-shadow duration-300 animate-fade-up">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {category}
          </span>
          <span className="text-sm text-gray-500">• {timeAgo}</span>
        </div>
        
        <h3 className="text-xl font-semibold mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-600 mb-4">{content}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className={`space-x-2 ${hasVoted ? 'text-primary' : ''}`}
              onClick={handleVote}
            >
              <Heart className={`w-4 h-4 ${hasVoted ? 'fill-current' : ''}`} />
              <span>{votes}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="space-x-2"
              onClick={handleComment}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{comments}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleShare}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
          <div className="text-sm text-gray-500">
            Posted by <span className="font-medium text-gray-900">{author}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};