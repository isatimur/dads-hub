-- supabase/migrations/20250525172803_add_status_to_resources.sql

-- Add the status column to the resources table
ALTER TABLE public.resources
  ADD COLUMN status TEXT NOT NULL DEFAULT 'pending',
  ADD CONSTRAINT check_resource_status CHECK (status IN ('pending', 'approved', 'rejected'));

-- Update RLS policies for public.resources

-- 1. Drop the existing public select policy (if it exists with the same name, or find its actual name)
--    It's safer to drop by finding the specific policy object if the name isn't guaranteed.
--    However, for a known name from our previous migration:
DROP POLICY IF EXISTS "Public resources are viewable by everyone." ON public.resources;

-- 2. Create the new policy for approved resources
CREATE POLICY "Approved resources are viewable by everyone." ON public.resources
  FOR SELECT
  USING (status = 'approved');

-- 3. Ensure authenticated users can still suggest resources (which will default to 'pending')
--    The existing INSERT policy is likely fine:
--    "Authenticated users can suggest resources." ON public.resources FOR INSERT TO authenticated WITH CHECK (auth.uid() = submitted_by_user_id);
--    This policy does not need to change due to the new status column, as the DEFAULT 'pending' handles the status on insert.

-- 4. (Optional but good practice) Add an index on the new status column if resources will often be queried by status.
CREATE INDEX IF NOT EXISTS idx_resources_status ON public.resources(status);
