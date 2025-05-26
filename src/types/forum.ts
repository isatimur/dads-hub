// src/types/forum.ts
export interface ForumCategory {
  id: number;
  name: string;
  description?: string | null;
  slug: string;
  created_at?: string;
}

export interface ForumThread {
  id: number;
  category_id: number;
  user_id: string;
  title: string;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
  profiles?: { // Joined from profiles table
    display_name: string | null;
  } | null;
  post_count?: number; // Optional: typically from a view or aggregate query
}

export interface ForumPost {
  id: number;
  thread_id: number;
  user_id: string;
  content: string;
  parent_post_id?: number | null;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string;
  profiles?: { // Joined from profiles table
    display_name: string | null;
  } | null;
  // children?: ForumPost[]; // For client-side nesting if implemented
}
