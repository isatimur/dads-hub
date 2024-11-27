import { Button } from "./ui/button";
import { useState } from "react";

const categories = [
  "All",
  "Newborns",
  "Toddlers",
  "School Age",
  "Teenagers",
  "Communication",
  "Self Care",
  "Co-Parenting",
  "Activities",
];

interface CategoryListProps {
  onCategoryChange: (category: string) => void;
}

export const CategoryList = ({ onCategoryChange }: CategoryListProps) => {
  const [activeCategory, setActiveCategory] = useState("All");

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    onCategoryChange(category);
  };

  return (
    <div className="w-full overflow-x-auto pb-4 mb-6 animate-fade-in">
      <div className="flex space-x-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={category === activeCategory ? "default" : "outline"}
            className="whitespace-nowrap transition-all duration-200 hover:scale-105"
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};