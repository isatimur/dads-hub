import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { CategoryList } from "@/components/CategoryList";
import { RulesSidebar } from "@/components/RulesSidebar";
import { useSession } from "@supabase/auth-helpers-react";
import { usePosts } from "@/hooks/usePosts";
import { ForumHeader } from "@/components/forum/ForumHeader";
import { SortControls } from "@/components/forum/SortControls";
import { PostList } from "@/components/forum/PostList";
import { sortPosts, SortOption } from "@/utils/postSorting";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("hot");
  const session = useSession();
  const navigate = useNavigate();
  const { data: posts, isLoading, error } = usePosts(selectedCategory);

  useEffect(() => {
    if (!session) {
      navigate("/auth");
    }
  }, [session, navigate]);

  if (!session) return null;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 pt-24">
          <div className="text-center text-red-500">
            Error loading posts. Please try again later.
          </div>
        </main>
      </div>
    );
  }

  const sortedPosts = posts ? sortPosts(posts, sortBy) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2">
            <ForumHeader />
            <SortControls sortBy={sortBy} onSortChange={setSortBy} />
            <CategoryList onCategoryChange={setSelectedCategory} />
            {isLoading ? (
              <div className="flex justify-center items-center h-48">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <PostList posts={sortedPosts} isLoading={isLoading} />
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