import { Button } from "./ui/button";
import { useState } from "react";
import { 
  Heart, 
  Clock, 
  Brain, 
  Users, 
  Baby, 
  Sparkles, 
  HeartPulse, 
  Smartphone, 
  Wallet 
} from "lucide-react";

const categories = [
  {
    id: "all",
    label: "All Posts",
    icon: <Users className="w-5 h-5" />,
    description: "Browse all dad discussions"
  },
  {
    id: "emotional-intelligence",
    label: "Emotional Intelligence",
    icon: <Heart className="w-5 h-5" />,
    description: "Connect with your kids"
  },
  {
    id: "quality-time",
    label: "Quality Time",
    icon: <Clock className="w-5 h-5" />,
    description: "Make moments count"
  },
  {
    id: "personal-growth",
    label: "Personal Growth",
    icon: <Brain className="w-5 h-5" />,
    description: "Be a better dad"
  },
  {
    id: "work-life-balance",
    label: "Work-Life Balance",
    icon: <Users className="w-5 h-5" />,
    description: "Family comes first"
  },
  {
    id: "child-development",
    label: "Child Development",
    icon: <Baby className="w-5 h-5" />,
    description: "Watch them grow"
  },
  {
    id: "family-traditions",
    label: "Family Traditions",
    icon: <Sparkles className="w-5 h-5" />,
    description: "Build lasting memories"
  },
  {
    id: "health-wellness",
    label: "Health & Wellness",
    icon: <HeartPulse className="w-5 h-5" />,
    description: "Stay fit for them"
  },
  {
    id: "digital-parenting",
    label: "Digital Parenting",
    icon: <Smartphone className="w-5 h-5" />,
    description: "Tech-savvy parenting"
  },
  {
    id: "financial-planning",
    label: "Financial Planning",
    icon: <Wallet className="w-5 h-5" />,
    description: "Secure their future"
  }
];

interface CategoryListProps {
  onCategoryChange: (category: string) => void;
}

export const CategoryList = ({ onCategoryChange }: CategoryListProps) => {
  const [activeCategory, setActiveCategory] = useState("all");

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
    onCategoryChange(categoryId);
  };

  return (
    <div className="w-full overflow-x-auto pb-4 mb-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-1">
        {categories.map(({ id, label, icon, description }) => (
          <Button
            key={id}
            variant={id === activeCategory ? "default" : "outline"}
            className={`
              h-auto py-4 px-4 flex flex-col items-center text-center gap-2
              transition-all duration-300 hover:scale-105 hover:shadow-md
              ${id === activeCategory ? 'ring-2 ring-primary/20' : ''}
              group
            `}
            onClick={() => handleCategoryClick(id)}
          >
            <span className="text-2xl mb-1 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
              {icon}
            </span>
            <span className="font-medium mb-1">{label}</span>
            <span className="text-xs text-muted-foreground line-clamp-1">{description}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};