import { supabase } from '@/lib/supabase';

export async function fetchPost(slug: string) {
    const { data: post, error } = await supabase
        .from('posts')
        .select(`
      id,
      title,
      content,
      description,
      image_url,
      published_at,
      tags,
      author:users (
        id,
        full_name,
        avatar_url
      )
    `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

    if (error) throw error;
    return post;
}