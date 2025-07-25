import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import PostItem from "../components/PostItem";
export interface Post {
    id: string;
    user_id: string;
    content: string;
    buy_in: number;
    buy_out: number;
    created_at: string;
    display_name: string;
    date: Date;
}

function ViewPosts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [error, setError] = useState<string | null>(null);

    const [showCreatePost, setShowCreatePost] = useState(false);

    const fetchPosts = async () => {
        try {
            setError(null);
            const { data, error } = await supabase.from('posts').select('*').order('date', { ascending: false });
            if(error) throw error;
            setPosts(data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch posts');
        }
    }

    useEffect(() => {
        fetchPosts();
    }, [])

    useEffect(() => {
        const channel = supabase.channel('public:posts').on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'posts' }, () => {
                fetchPosts();
            }).subscribe();

            return () => {
                supabase.removeChannel(channel);
            }
    }, [])


  return (
    <div className="text-text text-lg flex justify-center mt-12 pt-4">
        <div className="flex flex-col gap-4">
            {posts.map((post) => (
                <PostItem key={post.id} post={post} />
            ))}
        </div>
    </div>
  )
}

export default ViewPosts