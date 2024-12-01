import { Button } from "./ui/button";
import { useState } from "react";

const categories = [
  {
    id: "all",
    label: "All",
    icon: "📋",
    description: "View all posts"
  },
  {
    id: "difficult-conversations",
    label: "Difficult Conversations",
    icon: "💭",
    description: "Guide for handling challenging topics"
  },
  {
    id: "emotional-support",
    label: "Emotional Support",
    icon: "❤️",
    description: "Supporting emotional well-being"
  },
  {
    id: "behavioral-guidance",
    label: "Behavioral Guidance",
    icon: "🌟",
    description: "Positive behavior strategies"
  },
  {
    id: "educational-development",
    label: "Educational",
    icon: "📚",
    description: "Support learning journey"
  },
  {
    id: "social-skills",
    label: "Social Skills",
    icon: "🤝",
    description: "Develop healthy relationships"
  },
  {
    id: "mental-health",
    label: "Mental Health",
    icon: "🧠",
    description: "Mental well-being support"
  },
  {
    id: "crisis-management",
    label: "Crisis Management",
    icon: "🆘",
    description: "Handle difficult situations"
  },
  {
    id: "age-specific-guidance",
    label: "Age-Specific",
    icon: "👶",
    description: "Age-tailored advice"
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
              h-auto py-3 px-4 flex flex-col items-center text-center
              transition-all duration-300 hover:scale-105 hover:shadow-md
              ${id === activeCategory ? 'ring-2 ring-primary/20' : ''}
            `}
            onClick={() => handleCategoryClick(id)}
          >
            <span className="text-2xl mb-2">{icon}</span>
            <span className="font-medium mb-1">{label}</span>
            <span className="text-xs text-muted-foreground">{description}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};