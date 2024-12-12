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
import { Button } from "@/components/ui/button";
import { sendEmail } from "@/utils/email";
import { toast } from "sonner";

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

  const handleTestEmail = async () => {
    try {
      await sendEmail({
        to: [session?.user?.email || ""],
        subject: "Test Email from DadSpace",
        html: "<h1>Hello from DadSpace!</h1><p>This is a test email to verify the Resend integration is working correctly.</p>",
      });
      toast.success("Test email sent successfully!");
    } catch (error) {
      console.error("Error sending test email:", error);
      toast.error("Failed to send test email. Check console for details.");
    }
  };

  if (!session) return null;

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        <Navbar />
        <main className="container mx-auto px-4 pt-24">
          <div className="text-center text-red-500 animate-fade-in glass-panel p-6">
            Error loading posts. Please try again later.
          </div>
        </main>
      </div>
    );
  }

  const sortedPosts = posts ? sortPosts(posts, sortBy) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2 space-y-6 animate-fade-up">
            <ForumHeader />
            <div className="glass-panel p-6">
              <div className="flex justify-between items-center mb-4">
                <SortControls sortBy={sortBy} onSortChange={setSortBy} />
                <Button 
                  onClick={handleTestEmail}
                  variant="outline"
                  className="glass-button"
                >
                  Test Email Integration
                </Button>
              </div>
              <CategoryList onCategoryChange={setSelectedCategory} />
            </div>
            {isLoading ? (
              <div className="flex justify-center items-center h-48 glass-panel">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <PostList posts={sortedPosts} isLoading={isLoading} />
            )}
          </div>
          <div className="hidden lg:block animate-fade-in">
            <div className="sticky top-24">
              <RulesSidebar />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;