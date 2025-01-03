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
import { Loader2, Users, Heart, Star, Shield } from "lucide-react";
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
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("onboarding_completed")
            .eq("id", session.user.id)
            .single();

          if (error) {
            console.error("Ошибка проверки статуса onboarding:", error);
            return;
          }

          if (!data?.onboarding_completed) {
            navigate("/onboarding");
          }
        } catch (err) {
          console.error("Ошибка в checkOnboarding:", err);
        }
      }
    };

    checkOnboarding();
  }, [session, supabase, navigate]);

  const handleSubscribe = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      if (!currentSession) {
        toast.error('Пожалуйста, войдите в систему, чтобы обновить');
        navigate('/auth');
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: {},
        headers: {
          Authorization: `Bearer ${currentSession?.access_token}`,
        },
      });

      if (error) {
        console.error('Ошибка создания сессии для оплаты:', error);
        toast.error('Не удалось начать процесс оплаты');
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error('Не удалось получить URL для оплаты');
      }
    } catch (error) {
      console.error('Ошибка создания сессии для оплаты:', error);
      toast.error('Не удалось начать процесс оплаты');
    }
  };

  const renderLandingSection = () => (
    <section className="min-h-screen flex flex-col justify-center py-20 overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-6">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent animate-fade-up">
            Добро пожаловать в Отец Молодец
          </h1>
          <p className="text-2xl text-gray-600 max-w-2xl mx-auto animate-fade-up delay-100">
            Присоединяйтесь к сообществу осознанных отцов на пути развития и общения.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {[
            {
              icon: <Users className="w-10 h-10 text-primary" />,
              title: "Сообщество",
              description: "Общайтесь с единомышленниками в дружественной атмосфере",
              delay: "delay-[200ms]"
            },
            {
              icon: <Heart className="w-10 h-10 text-primary" />,
              title: "Поддержка",
              description: "Делитесь опытом и получайте советы от других отцов",
              delay: "delay-[300ms]"
            },
            {
              icon: <Star className="w-10 h-10 text-primary" />,
              title: "Развитие",
              description: "Учитесь и развивайтесь как родитель через общую мудрость",
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
            <span>Безопасное и поддерживающее окружение</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 animate-fade-up delay-600">
          {[
            { label: "Активных участников", value: "1,000+" },
            { label: "Ежедневных обсуждений", value: "50+" },
            { label: "Историй успеха", value: "500+" },
            { label: "Лет опыта", value: "10+" }
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
          Ошибка загрузки публикаций. Пожалуйста, попробуйте позже.
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
