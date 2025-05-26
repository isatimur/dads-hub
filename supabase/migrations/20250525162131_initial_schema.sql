-- supabase/migrations/20250525162131_initial_schema.sql

-- Profiles table to extend auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  bio TEXT,
  number_of_children INTEGER,
  children_ages_info TEXT, -- Could be a JSON or text field for flexibility
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to automatically create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function after a new user is inserted into auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Forum Categories
CREATE TABLE public.forum_categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Forum Threads
CREATE TABLE public.forum_threads (
  id BIGSERIAL PRIMARY KEY,
  category_id BIGINT NOT NULL REFERENCES public.forum_categories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE, -- User who created the thread
  title TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW() -- For last activity sort
);
CREATE INDEX idx_forum_threads_category_id ON public.forum_threads(category_id);
CREATE INDEX idx_forum_threads_user_id ON public.forum_threads(user_id);

-- Forum Posts (includes replies, linked by parent_post_id)
CREATE TABLE public.forum_posts (
  id BIGSERIAL PRIMARY KEY,
  thread_id BIGINT NOT NULL REFERENCES public.forum_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE, -- User who made the post
  content TEXT NOT NULL,
  parent_post_id BIGINT REFERENCES public.forum_posts(id) ON DELETE CASCADE, -- For threaded replies
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_forum_posts_thread_id ON public.forum_posts(thread_id);
CREATE INDEX idx_forum_posts_user_id ON public.forum_posts(user_id);
CREATE INDEX idx_forum_posts_parent_post_id ON public.forum_posts(parent_post_id);

-- Resource Categories
CREATE TABLE public.resource_categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resources
CREATE TABLE public.resources (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  url TEXT, -- URL if it's a link, or path if uploaded (though direct uploads are more complex)
  type TEXT, -- e.g., 'article', 'video', 'book_recommendation'
  category_id BIGINT REFERENCES public.resource_categories(id) ON DELETE SET NULL,
  submitted_by_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- User who suggested it
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_resources_category_id ON public.resources(category_id);
CREATE INDEX idx_resources_submitted_by_user_id ON public.resources(submitted_by_user_id);

-- Q&A Questions
CREATE TABLE public.qna_questions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_qna_questions_user_id ON public.qna_questions(user_id);

-- Q&A Answers
CREATE TABLE public.qna_answers (
  id BIGSERIAL PRIMARY KEY,
  question_id BIGINT NOT NULL REFERENCES public.qna_questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_qna_answers_question_id ON public.qna_answers(question_id);
CREATE INDEX idx_qna_answers_user_id ON public.qna_answers(user_id);

-- Enable RLS and set basic policies for all tables
-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all profiles." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
-- Note: Deletion of profiles is linked to auth.users deletion by ON DELETE CASCADE.

-- Forum Categories
ALTER TABLE public.forum_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public forum_categories are viewable by everyone." ON public.forum_categories FOR SELECT USING (true);
-- For now, only allow admins to manage categories (manual insertion or via Supabase Studio)
CREATE POLICY "Admins can manage forum_categories." ON public.forum_categories FOR ALL USING (false) WITH CHECK (false); -- Placeholder, replace with actual admin role check

-- Forum Threads
ALTER TABLE public.forum_threads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public forum_threads are viewable by everyone." ON public.forum_threads FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert forum_threads." ON public.forum_threads FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own forum_threads." ON public.forum_threads FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own forum_threads." ON public.forum_threads FOR DELETE USING (auth.uid() = user_id);

-- Forum Posts
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public forum_posts are viewable by everyone." ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert forum_posts." ON public.forum_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own forum_posts." ON public.forum_posts FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own forum_posts." ON public.forum_posts FOR DELETE USING (auth.uid() = user_id);

-- Resource Categories
ALTER TABLE public.resource_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public resource_categories are viewable by everyone." ON public.resource_categories FOR SELECT USING (true);
CREATE POLICY "Admins can manage resource_categories." ON public.resource_categories FOR ALL USING (false) WITH CHECK (false); -- Placeholder

-- Resources
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public resources are viewable by everyone." ON public.resources FOR SELECT USING (true);
CREATE POLICY "Authenticated users can suggest resources." ON public.resources FOR INSERT TO authenticated WITH CHECK (auth.uid() = submitted_by_user_id);
-- Update/Delete policies for resources might be admin-only or more complex
CREATE POLICY "Admins can manage resources." ON public.resources FOR UPDATE USING (false) WITH CHECK (false); -- Placeholder
CREATE POLICY "Admins can manage resources." ON public.resources FOR DELETE USING (false) WITH CHECK (false); -- Placeholder


-- Q&A Questions
ALTER TABLE public.qna_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public qna_questions are viewable by everyone." ON public.qna_questions FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert qna_questions." ON public.qna_questions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own qna_questions." ON public.qna_questions FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own qna_questions." ON public.qna_questions FOR DELETE USING (auth.uid() = user_id);

-- Q&A Answers
ALTER TABLE public.qna_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public qna_answers are viewable by everyone." ON public.qna_answers FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert qna_answers." ON public.qna_answers FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own qna_answers." ON public.qna_answers FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own qna_answers." ON public.qna_answers FOR DELETE USING (auth.uid() = user_id);

-- The RLS policies for admin-only actions (like managing categories) are placeholders.
-- These would typically be replaced with a check against a custom 'user_roles' table
-- or Supabase's built-in role system if extended. For MVP, manual management via Supabase Studio is assumed for these.
