import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CategoryList } from "@/components/CategoryList";
import { RulesSidebar } from "@/components/RulesSidebar";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { usePosts } from "@/hooks/usePosts";
import { ForumHeader } from "@/components/forum/ForumHeader";
import { SortControls } from "@/components/forum/SortControls";
import { PostList } from "@/components/forum/PostList";
import { sortPosts, SortOption } from "@/utils/postSorting";
import { Loader2, ArrowRight, Users2, Shield, MessageSquare, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProUpgradeButton } from "@/components/subscription/ProUpgradeButton";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("hot");
  const session = useSession();
  const navigate = useNavigate();
  const supabase = useSupabaseClient();
  const { data: posts, isLoading, error } = usePosts(selectedCategory);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (session?.user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("onboarding_completed")
          .eq("id", session.user.id)
          .single();

        if (!error && data && !data.onboarding_completed) {
          navigate("/onboarding");
        }
      }
    };

    checkOnboarding();
  }, [session, supabase, navigate]);

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
    <section className="min-h-screen flex flex-col justify-center py-20 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-fade-up">
            Welcome to DadSpace
          </h1>
          <p className="text-2xl text-gray-600 max-w-2xl mx-auto animate-fade-up delay-100">
            Join a supportive community of conscious fathers on their journey of growth and connection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {[
            {
              icon: <Users2 className="w-10 h-10 text-primary" />,
              title: "Community",
              description: "Connect with like-minded fathers in a supportive environment",
              delay: "delay-[200ms]"
            },
            {
              icon: <Heart className="w-10 h-10 text-primary" />,
              title: "Support",
              description: "Share experiences and get advice from fellow dads",
              delay: "delay-[300ms]"
            },
            {
              icon: <Star className="w-10 h-10 text-primary" />,
              title: "Growth",
              description: "Learn and develop as a parent through shared wisdom",
              delay: "delay-[400ms]"
            }
          ].map((feature, index) => (
            <div 
              key={index}
              className={`glass-card p-8 text-center group hover:scale-105 transition-all duration-500 animate-fade-up ${feature.delay}`}
            >
              <div className="flex justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center space-y-8 animate-fade-up delay-500">
          <ProUpgradeButton />
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>Safe and supportive environment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 animate-fade-up delay-600">
          {[
            { label: "Active Members", value: "1,000+" },
            { label: "Daily Discussions", value: "50+" },
            { label: "Success Stories", value: "500+" },
            { label: "Years of Wisdom", value: "10+" }
          ].map((stat, index) => (
            <div key={index} className="glass-card p-6 text-center hover:scale-105 transition-all duration-300">
              <div className="text-2xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
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
                <ProUpgradeButton />
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
