import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/PostCard";
import { CategoryList } from "@/components/CategoryList";

const posts = [
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
  }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to DadSpace</h1>
          <p className="text-xl text-gray-600 mb-8">A community for conscious fathers supporting each other.</p>
          
          <CategoryList />
          
          <div className="space-y-6">
            {posts.map((post, index) => (
              <PostCard key={index} {...post} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;