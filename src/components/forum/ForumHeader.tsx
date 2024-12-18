import { MessageSquare } from "lucide-react";
import { CreatePostDialog } from "../CreatePostDialog";

export const ForumHeader = () => {
  return (
    <div className="flex items-center justify-between mb-6 animate-fade-up">
      <div className="flex items-center gap-3">
        <MessageSquare className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold text-gray-900">Community Forum</h1>
      </div>
      <CreatePostDialog />
    </div>
  );
};