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
        className={`group transition-all duration-300 hover:scale-105 active:scale-95 rounded-xl
          ${hasReacted ? "text-primary bg-primary/10 shadow-sm shadow-primary/10" : 
            "hover:text-primary hover:bg-primary/5"}`}
        onClick={onReaction}
      >
        <Heart
          className={`w-4 h-4 mr-1 transition-all duration-300 
            ${hasReacted
              ? "fill-current animate-[heartbeat_1s_ease-in-out_infinite]"
              : "group-hover:fill-primary/20 group-hover:scale-110"
            }`}
        />
        <span className="font-medium transition-transform duration-300 
          group-hover:scale-110">{reactionCount}</span>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onReply}
        className="group hover:bg-primary/10 text-primary font-medium 
          transition-all duration-300 hover:scale-105 active:scale-95 rounded-xl
          hover:shadow-sm hover:shadow-primary/10"
      >
        <Reply className="w-4 h-4 mr-1 transition-all duration-300 
          group-hover:-translate-y-0.5 group-hover:rotate-[-8deg] group-hover:scale-110" />
        Reply
      </Button>
      {showModifyActions && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
            className="group hover:bg-primary/10 transition-all duration-300 
              hover:scale-105 active:scale-95 hover:shadow-sm hover:shadow-primary/10 rounded-xl"
          >
            <Edit2 className="w-4 h-4 mr-1 transition-all duration-300 
              group-hover:rotate-12 group-hover:scale-110" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="group hover:bg-destructive/10 text-destructive 
              transition-all duration-300 hover:scale-105 active:scale-95 rounded-xl
              hover:shadow-sm hover:shadow-destructive/10"
          >
            <Trash2 className="w-4 h-4 mr-1 transition-all duration-300 
              group-hover:rotate-12 group-hover:scale-110" />
            Delete
          </Button>
        </>
      )}
    </div>
  );
};