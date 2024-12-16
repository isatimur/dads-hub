import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryList } from "@/components/CategoryList";
import { RulesSidebar } from "@/components/RulesSidebar";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { usePosts } from "@/hooks/usePosts";
import { ForumHeader } from "@/components/forum/ForumHeader";
import { SortControls } from "@/components/forum/SortControls";
import { PostList } from "@/components/forum/PostList";
import { sortPosts, SortOption } from "@/utils/postSorting";
import { Loader2, ArrowRight, Users2, Shield, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MainLayout } from "@/components/layout/MainLayout";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("hot");
  const session = useSession();
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const { data: posts, isLoading, error } = usePosts(selectedCategory);

  const handleSubscribe = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        toast.error('Please sign in to upgrade');
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        headers: {
          Authorization: `Bearer ${currentSession?.access_token}`,
        },
      });

      if (error) {
        console.error('Error creating checkout session:', error);
        toast.error('Failed to start checkout process');
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to start checkout process');
    }
  };

  const renderLandingSection = () => (
    <section className="py-20 text-center">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-5xl font-bold text-gray-900 mb-6 animate-fade-up">
          Welcome to DadSpace
        </h1>
        <p className="text-xl text-gray-600 mb-8 animate-fade-up delay-100">
          A supportive community for conscious fathers to connect, share, and grow together.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: <Users2 className="w-8 h-8 text-primary" />,
              title: "Community",
              description: "Connect with like-minded fathers"
            },
            {
              icon: <Shield className="w-8 h-8 text-primary" />,
              title: "Safe Space",
              description: "Share experiences in a supportive environment"
            },
            {
              icon: <MessageSquare className="w-8 h-8 text-primary" />,
              title: "Discussions",
              description: "Engage in meaningful conversations"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className="p-6 glass-card hover:scale-105 transition-transform duration-300 animate-fade-up"
              style={{ animationDelay: `${(index + 2) * 100}ms` }}
            >
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
        <Button 
          onClick={() => navigate(session ? "/" : "/auth")}
          size="lg"
          className="animate-fade-up delay-500 group"
        >
          Get Started
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </section>
  );

  if (error) {
    return (
      <MainLayout>
        <div className="text-center text-red-500 animate-fade-in glass-panel p-6">
          Error loading posts. Please try again later.
        </div>
      </MainLayout>
    );
  }

  const sortedPosts = posts ? sortPosts(posts, sortBy) : [];

  return (
    <MainLayout>
      {!session ? renderLandingSection() : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="lg:col-span-2 space-y-6 animate-fade-up">
            <ForumHeader />
            <div className="glass-panel p-6">
              <div className="flex justify-between items-center mb-4">
                <SortControls sortBy={sortBy} onSortChange={setSortBy} />
                <Button 
                  onClick={handleSubscribe}
                  className="bg-gradient-to-r from-primary to-accent hover:opacity-90"
                >
                  Upgrade to Pro
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
      )}
    </MainLayout>
  );
};

export default Index;