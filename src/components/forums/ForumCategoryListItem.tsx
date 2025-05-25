import { Link } from "react-router-dom";
import type { ForumCategory } from "@/types/forum"; // Adjusted path if types are elsewhere

interface ForumCategoryListItemProps {
  category: ForumCategory;
}

export const ForumCategoryListItem = ({ category }: ForumCategoryListItemProps) => {
  return (
    <Link 
      to={`/forums/${category.slug}`} 
      className="block p-6 border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out bg-white dark:bg-gray-800 dark:border-gray-700"
    >
      <h2 className="text-xl font-semibold text-primary dark:text-primary-400 mb-1">{category.name}</h2>
      {category.description && (
        <p className="text-gray-600 dark:text-gray-400 text-sm">{category.description}</p>
      )}
    </Link>
  );
};
