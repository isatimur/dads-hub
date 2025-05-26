-- supabase/migrations/20250525171405_update_thread_timestamp_trigger.sql

CREATE OR REPLACE FUNCTION public.update_thread_updated_at_on_new_post()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.forum_threads
  SET updated_at = NOW()
  WHERE id = NEW.thread_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
-- Using default security invoker, as the user inserting the post should have rights to effectively cause this update.

CREATE TRIGGER on_new_forum_post_update_thread_timestamp
  AFTER INSERT ON public.forum_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_thread_updated_at_on_new_post();

-- Also, ensure forum_threads.updated_at is properly indexed if not already.
-- It was created in the initial schema, so this is just a reminder.
-- CREATE INDEX IF NOT EXISTS idx_forum_threads_updated_at ON public.forum_threads(updated_at);
-- The initial schema already created indexes on category_id and user_id for forum_threads.
-- An index on updated_at is good for sorting by recent activity. Let's add it if it's not there.

-- Check if the index exists before creating it to make the script idempotent
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM   pg_class c
    JOIN   pg_namespace n ON n.oid = c.relnamespace
    WHERE  c.relname = 'idx_forum_threads_updated_at'
    AND    n.nspname = 'public'
  ) THEN
    CREATE INDEX idx_forum_threads_updated_at ON public.forum_threads(updated_at);
  END IF;
END$$;
