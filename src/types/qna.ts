// src/types/qna.ts
export interface QnaQuestion {
  id: number;
  user_id: string;
  title: string;
  description?: string | null;
  is_anonymous: boolean;
  created_at: string;
  updated_at: string; // For sorting by recent activity
  profiles?: { // Joined from profiles table
    display_name: string | null;
  } | null;
  answer_count?: number; // Optional: typically from a view or aggregate query
}

export interface QnaAnswer {
  id: number;
  question_id: number;
  user_id: string;
  content: string;
  is_anonymous: boolean;
  created_at: string;
  // updated_at is not typically on answers unless they are editable
  profiles?: { // Joined from profiles table
    display_name: string | null;
  } | null;
}
