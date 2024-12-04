import { Button } from "@/components/ui/button";
import { Flame, Sparkles, Clock } from "lucide-react";
import { SortOption } from "@/utils/postSorting";

interface SortControlsProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const SortControls = ({ sortBy, onSortChange }: SortControlsProps) => {
  return (
    <div className="flex items-center gap-4 mb-6 animate-fade-up">
      <Button
        variant={sortBy === "hot" ? "default" : "ghost"}
        onClick={() => onSortChange("hot")}
        className="group"
      >
        <Flame className="w-4 h-4 mr-2 transition-all duration-300 
          group-hover:scale-110 group-hover:rotate-12" />
        Hot
      </Button>
      <Button
        variant={sortBy === "new" ? "default" : "ghost"}
        onClick={() => onSortChange("new")}
        className="group"
      >
        <Sparkles className="w-4 h-4 mr-2 transition-all duration-300 
          group-hover:scale-110 group-hover:rotate-12" />
        New
      </Button>
      <Button
        variant={sortBy === "top" ? "default" : "ghost"}
        onClick={() => onSortChange("top")}
        className="group"
      >
        <Clock className="w-4 h-4 mr-2 transition-all duration-300 
          group-hover:scale-110 group-hover:rotate-12" />
        Top
      </Button>
    </div>
  );
};