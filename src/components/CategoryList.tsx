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
    description: "View all community posts"
  },
  {
    id: "emotional-intelligence",
    label: "Emotional Intelligence",
    icon: <Heart className="w-5 h-5" />,
    description: "Building emotional awareness and connection"
  },
  {
    id: "quality-time",
    label: "Quality Time",
    icon: <Clock className="w-5 h-5" />,
    description: "Meaningful activities and bonding"
  },
  {
    id: "personal-growth",
    label: "Personal Growth",
    icon: <Brain className="w-5 h-5" />,
    description: "Developing yourself as a father"
  },
  {
    id: "work-life-balance",
    label: "Work-Life Balance",
    icon: <Users className="w-5 h-5" />,
    description: "Managing career and family"
  },
  {
    id: "child-development",
    label: "Child Development",
    icon: <Baby className="w-5 h-5" />,
    description: "Understanding developmental stages"
  },
  {
    id: "family-traditions",
    label: "Family Traditions",
    icon: <Sparkles className="w-5 h-5" />,
    description: "Creating lasting memories"
  },
  {
    id: "health-wellness",
    label: "Health & Wellness",
    icon: <HeartPulse className="w-5 h-5" />,
    description: "Physical and mental health"
  },
  {
    id: "digital-parenting",
    label: "Digital Parenting",
    icon: <Smartphone className="w-5 h-5" />,
    description: "Navigate technology use"
  },
  {
    id: "financial-planning",
    label: "Financial Planning",
    icon: <Wallet className="w-5 h-5" />,
    description: "Secure your family's future"
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
            <span className="text-xs text-muted-foreground">{description}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};