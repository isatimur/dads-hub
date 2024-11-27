import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/PostCard";
import { CategoryList } from "@/components/CategoryList";

const samplePosts = [
  {
    title: "How to handle tantrums mindfully?",
    content: "My 3-year-old has been having intense tantrums lately. I want to handle them in a way that helps him learn emotional regulation. Any experienced dads have advice?",
    author: "mindful_dad_2024",
    category: "Toddlers",
    votes: 45,
    comments: 23,
    timeAgo: "2h ago"
  },
  {
    title: "Building confidence in teenage daughter",
    content: "Looking for ways to support my 14-year-old daughter's self-esteem. She's struggling with social media pressure and I want to help without being overbearing.",
    author: "caring_father",
    category: "Teenagers",
    votes: 89,
    comments: 34,
    timeAgo: "5h ago"
  },
  {
    title: "Weekend activity ideas for single dads",
    content: "Recently became a single dad to two boys (7 and 9). Looking for engaging weekend activities that don't break the bank. What works for you guys?",
    author: "active_dad_123",
    category: "Activities",
    votes: 67,
    comments: 45,
    timeAgo: "12h ago"
  },
  {
    title: "Sleep training success story",
    content: "After months of struggle, finally got my 6-month-old to sleep through the night. Here's what worked for us...",
    author: "sleepy_dad",
    category: "Newborns",
    votes: 120,
    comments: 56,
    timeAgo: "1d ago"
  }
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = selectedCategory === "All" 
    ? samplePosts 
    : samplePosts.filter(post => post.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2 animate-fade-up">Welcome to DadSpace</h1>
          <p className="text-xl text-gray-600 mb-8 animate-fade-up">A community for conscious fathers supporting each other.</p>
          
          <CategoryList onCategoryChange={setSelectedCategory} />
          
          <div className="space-y-6">
            {filteredPosts.map((post, index) => (
              <PostCard key={index} {...post} />
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No posts found in this category yet.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;