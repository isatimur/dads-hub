import { MessageCircle } from "lucide-react";

interface CommentHeaderProps {
  author: {
    username: string;
  };
  created_at: string;
}

export const CommentHeader = ({ author, created_at }: CommentHeaderProps) => {
  return (
    <div className="flex justify-between items-start mb-2">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-4 h-4 text-primary" />
        <span className="font-medium text-primary">{author?.username || "Anonymous"}</span>
      </div>
      <span className="text-sm text-gray-500">
        {new Date(created_at).toLocaleDateString()}
      </span>
    </div>
  );
};