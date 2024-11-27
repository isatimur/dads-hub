import { Button } from "./ui/button";
import { useState } from "react";

const categories = [
  {
    id: "all",
    label: "All",
    icon: "📋"
  },
  {
    id: "newborns",
    label: "Newborns",
    icon: "👶"
  },
  {
    id: "toddlers",
    label: "Toddlers",
    icon: "🚶"
  },
  {
    id: "school-age",
    label: "School Age",
    icon: "🎒"
  },
  {
    id: "teenagers",
    label: "Teenagers",
    icon: "🧑"
  },
  {
    id: "communication",
    label: "Communication",
    icon: "💭"
  },
  {
    id: "self-care",
    label: "Self Care",
    icon: "🧘"
  },
  {
    id: "co-parenting",
    label: "Co-Parenting",
    icon: "👥"
  },
  {
    id: "activities",
    label: "Activities",
    icon: "🎨"
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
      <div className="flex space-x-2 p-1">
        {categories.map(({ id, label, icon }) => (
          <Button
            key={id}
            variant={id === activeCategory ? "default" : "outline"}
            className={`
              whitespace-nowrap transition-all duration-300
              hover:scale-105 hover:shadow-md
              ${id === activeCategory ? 'ring-2 ring-primary/20' : ''}
            `}
            onClick={() => handleCategoryClick(id)}
          >
            <span className="mr-2">{icon}</span>
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
};