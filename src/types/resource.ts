// src/types/resource.ts
export interface ResourceCategory {
  id: number;
  name: string;
  description?: string | null;
  // slug?: string; // If we navigate to category pages, a slug is useful
}

export interface Resource {
  id: number;
  title: string;
  description?: string | null;
  url?: string | null; // Can be null if it's e.g. a book title not a direct link
  type?: string | null; // e.g., 'article', 'video', 'book', 'website', 'tool'
  category_id?: number | null;
  // Joined data from resource_categories table
  resource_categories?: { // Supabase convention for joined table
    id: number;
    name: string;
  } | null;
  submitted_by_user_id?: string | null;
  profiles?: { // Joined from profiles table for submitter info
    display_name: string | null;
  } | null;
  status: 'pending' | 'approved' | 'rejected'; // Added in previous backend step
  created_at: string;
}
