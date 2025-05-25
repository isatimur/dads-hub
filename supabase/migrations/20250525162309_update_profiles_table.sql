-- supabase/migrations/20250525162309_update_profiles_table.sql

ALTER TABLE public.profiles
  ADD COLUMN children JSONB,
  ADD COLUMN parenting_goals TEXT[],
  ADD COLUMN interests TEXT[];

ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS number_of_children,
  DROP COLUMN IF EXISTS children_ages_info;
