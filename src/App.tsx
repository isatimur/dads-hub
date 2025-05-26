import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import AuthPage from "./pages/Auth";
import Profile from "./pages/Profile";
import { OnboardingFlow } from "./components/onboarding/OnboardingFlow";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import { Contact } from "lucide-react";
import FAQ from "./pages/FAQ";
import { PostDetail } from "./pages/PostDetail";
import { HelmetProvider } from "react-helmet-async";
import ForumIndexPage from "./pages/forums/ForumIndexPage";
import ForumCategoryPage from "./pages/forums/ForumCategoryPage";
import ThreadPage from "./pages/threads/ThreadPage";
import ResourceIndexPage from "./pages/resources/ResourceIndexPage";
import QnaIndexPage from "./pages/qna/QnaIndexPage";
import QnaQuestionPage from "./pages/qna/QnaQuestionPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider supabaseClient={supabase}>
      <HelmetProvider>
      <TooltipProvider>
        <Toaster />
        <SonnerToaster />
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/onboarding" element={<OnboardingFlow />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          {/* Forum Routes */}
          <Route path="/forums" element={<ForumIndexPage />} />
          <Route path="/forums/:categorySlug" element={<ForumCategoryPage />} />
          <Route path="/threads/:threadId" element={<ThreadPage />} />
          <Route path="/resources" element={<ResourceIndexPage />} />
          {/* Q&A Routes */}
          <Route path="/qna" element={<QnaIndexPage />} />
          <Route path="/qna/:questionId" element={<QnaQuestionPage />} />
          <Route path="/post/:slug" element={<PostDetail />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
      </HelmetProvider>
    </SessionContextProvider>
  </QueryClientProvider>
);

export default App;