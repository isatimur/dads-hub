import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { PostCard } from "@/components/PostCard";
import { CategoryList } from "@/components/CategoryList";
import { Button } from "@/components/ui/button";
import { PenSquare } from "lucide-react";
import { useSession } from "@supabase/auth-helpers-react";
import { usePosts } from "@/hooks/usePosts";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const session = useSession();
  const navigate = useNavigate();
  const { data: posts, isLoading } = usePosts(selectedCategory);

  useEffect(() => {
    if (!session) {
      navigate("/auth");
    }
  }, [session, navigate]);

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-8 animate-fade-up">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to DadSpace</h1>
              <p className="text-xl text-gray-600">A community for conscious fathers supporting each other.</p>
            </div>
            <Button className="hidden md:flex items-center space-x-2">
              <PenSquare className="w-4 h-4" />
              <span>Create Post</span>
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
              {posts?.map((post) => (
                <PostCard
                  key={post.id}
                  title={post.title}
                  content={post.content}
                  author={post.author.username}
                  category={post.category.name}
                  votes={post.votes}
                  comments={post.comments.length}
                  timeAgo={new Date(post.created_at).toLocaleDateString()}
                />
              ))}
            </div>
          )}

          {posts?.length === 0 && (
            <div className="text-center py-10 text-gray-500 animate-fade-in">
              <p className="text-lg mb-4">No posts found in this category yet.</p>
              <Button variant="outline">Create the first post</Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;