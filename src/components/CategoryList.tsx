import { Button } from "./ui/button";

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

export const CategoryList = () => {
  return (
    <div className="w-full overflow-x-auto pb-4 mb-6">
      <div className="flex space-x-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={category === "All" ? "default" : "outline"}
            className="whitespace-nowrap"
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};