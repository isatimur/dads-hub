import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import { MainLayout } from "@/components/layout/MainLayout";

const AuthPage = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  return (
    <MainLayout>
      <div className="max-w-md mx-auto glass-panel p-8 animate-fade-up">
        <h1 className="text-2xl font-bold text-center mb-6">Добро пожаловать в Отец Молодец</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#8B5CF6',
                  brandAccent: '#7E69AB',
                },
              },
            },
          }}
          providers={["google", "github"]}
        />
      </div>
    </MainLayout>
  );
};

export default AuthPage;