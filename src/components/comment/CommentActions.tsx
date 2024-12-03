import { Heart, Reply, Edit2, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

interface CommentActionsProps {
  hasReacted: boolean;
  reactionCount: number;
  onReaction: () => void;
  onReply: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showModifyActions?: boolean;
}

export const CommentActions = ({
  hasReacted,
  reactionCount,
  onReaction,
  onReply,
  onEdit,
  onDelete,
  showModifyActions,
}: CommentActionsProps) => {
  return (
    <div className="flex items-center gap-2 mt-2">
      <Button
        variant="ghost"
        size="sm"
        className={`group transition-all duration-200 ${
          hasReacted ? "text-primary" : "hover:text-primary"
        }`}
        onClick={onReaction}
      >
        <Heart
          className={`w-4 h-4 mr-1 transition-all duration-200 ${
            hasReacted
              ? "fill-current"
              : "group-hover:fill-primary/20"
          }`}
        />
        <span className="font-medium">{reactionCount}</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onReply}
        className="group hover:bg-primary/10 text-primary font-medium transition-all duration-200 hover:scale-105"
      >
        <Reply className="w-4 h-4 mr-1 transition-transform duration-200 group-hover:-translate-y-0.5" />
        Reply
      </Button>
      {showModifyActions && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="group hover:bg-primary/10 transition-all duration-200"
          >
            <Edit2 className="w-4 h-4 mr-1 transition-transform duration-200 group-hover:rotate-12" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="group hover:bg-destructive/10 text-destructive transition-all duration-200"
          >
            <Trash2 className="w-4 h-4 mr-1 transition-transform duration-200 group-hover:scale-110" />
            Delete
          </Button>
        </>
      )}
    </div>
  );
};