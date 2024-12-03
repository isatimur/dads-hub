import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/PostCard";
import { CategoryList } from "@/components/CategoryList";
import { CreatePostDialog } from "@/components/CreatePostDialog";
import { RulesSidebar } from "@/components/RulesSidebar";
import { useSession } from "@supabase/auth-helpers-react";
import { usePosts } from "@/hooks/usePosts";
import { Button } from "@/components/ui/button";
import { Flame, Sparkles, Clock } from "lucide-react";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"new" | "hot" | "top">("hot");
  const session = useSession();
  const navigate = useNavigate();
  const { data: posts, isLoading } = usePosts(selectedCategory);

  useEffect(() => {
    if (!session) {
      navigate("/auth");
    }
  }, [session, navigate]);

  if (!session) return null;

  const sortedPosts = posts?.slice().sort((a, b) => {
    switch (sortBy) {
      case "new":
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case "hot":
        // Sort by a combination of votes and recency
        const aHotScore = a.votes * (1 / Math.pow((Date.now() - new Date(a.created_at).getTime()) / 3600000 + 2, 1.5));
        const bHotScore = b.votes * (1 / Math.pow((Date.now() - new Date(b.created_at).getTime()) / 3600000 + 2, 1.5));
        return bHotScore - aHotScore;
      case "top":
        return (b.votes || 0) - (a.votes || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8 animate-fade-up">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to DadSpace</h1>
                <p className="text-xl text-gray-600">A community for conscious fathers supporting each other.</p>
              </div>
              <CreatePostDialog />
            </div>

            <div className="flex items-center gap-4 mb-6 animate-fade-up">
              <Button
                variant={sortBy === "hot" ? "default" : "ghost"}
                onClick={() => setSortBy("hot")}
                className="group"
              >
                <Flame className="w-4 h-4 mr-2 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                Hot
              </Button>
              <Button
                variant={sortBy === "new" ? "default" : "ghost"}
                onClick={() => setSortBy("new")}
                className="group"
              >
                <Sparkles className="w-4 h-4 mr-2 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                New
              </Button>
              <Button
                variant={sortBy === "top" ? "default" : "ghost"}
                onClick={() => setSortBy("top")}
                className="group"
              >
                <Clock className="w-4 h-4 mr-2 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
                Top
              </Button>
            </div>

            <CategoryList onCategoryChange={setSelectedCategory} />

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-full h-48 bg-gray-200 animate-pulse rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {sortedPosts?.map((post) => (
                  <PostCard
                    key={post.id}
                    id={post.id}
                    title={post.title}
                    content={post.content}
                    author={post.author?.username || 'Anonymous'}
                    category={post.category?.name || 'Uncategorized'}
                    votes={post.votes}
                    comments={post.comments || []}
                    timeAgo={new Date(post.created_at).toLocaleDateString()}
                  />
                ))}
              </div>
            )}

            {posts?.length === 0 && (
              <div className="text-center py-10 text-gray-500 animate-fade-in">
                <p className="text-lg mb-4">No posts found in this category yet.</p>
                <CreatePostDialog />
              </div>
            )}
          </div>

          <div className="hidden lg:block">
            <RulesSidebar />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;