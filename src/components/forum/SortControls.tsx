import { Button } from "../ui/button";
import { Flame, Clock, ThumbsUp } from "lucide-react";

export type SortOption = "hot" | "new" | "top";

interface SortControlsProps {
  sortBy: SortOption;
  onSortChange: (option: SortOption) => void;
}

export const SortControls = ({ sortBy, onSortChange }: SortControlsProps) => {
  return (
    <div className="flex gap-2">
      <Button
        variant={sortBy === "hot" ? "default" : "ghost"}
        size="sm"
        onClick={() => onSortChange("hot")}
        className="gap-2"
      >
        <Flame className="w-4 h-4" />
        Горячие
      </Button>
      <Button
        variant={sortBy === "new" ? "default" : "ghost"}
        size="sm"
        onClick={() => onSortChange("new")}
        className="gap-2"
      >
        <Clock className="w-4 h-4" />
        Новые
      </Button>
      <Button
        variant={sortBy === "top" ? "default" : "ghost"}
        size="sm"
        onClick={() => onSortChange("top")}
        className="gap-2"
      >
        <ThumbsUp className="w-4 h-4" />
        Лучшие
      </Button>
    </div>
  );
};