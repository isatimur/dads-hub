import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AuthPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        navigate("/");
      } else if (event === "USER_UPDATED") {
        // Handle email confirmation
        if (session?.user.email_confirmed_at) {
          toast.success("Email confirmed successfully!");
          navigate("/");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Welcome to DadSpace</h2>
          <p className="mt-2 text-gray-600">Join our community of conscious fathers</p>
          <p className="mt-2 text-sm text-gray-500">You will need to confirm your email address after signing up</p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          theme="light"
          redirectTo={`${window.location.origin}/auth/callback`}
          magicLink={false}
          showLinks={true}
          onlyThirdPartyProviders={false}
        />
      </div>
    </div>
  );
};

export default AuthPage;