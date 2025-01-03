import { MessageCircle } from "lucide-react";

interface CommentHeaderProps {
  author: {
    username: string;
  };
  created_at: string;
}

export const CommentHeader = ({ author, created_at }: CommentHeaderProps) => {
  return (
    <div className="flex justify-between items-start mb-2 group">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-4 h-4 text-primary transition-transform 
          duration-300 group-hover:scale-110 group-hover:rotate-12" />
        <span className="font-medium text-primary transition-all duration-300 
          group-hover:scale-105">{author?.username || "Аноним"}</span>
      </div>
      <span className="text-sm text-gray-500 transition-colors duration-300 
        group-hover:text-gray-700">
        {new Date(created_at).toLocaleDateString()}
      </span>
    </div>
  );
};