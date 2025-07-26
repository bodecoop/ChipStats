import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import PostItem from "../components/PostItem";
import Friends from "../components/Friends";
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
    <div className="text-text text-lg flex justify-center mt-12 pt-4 gap-8">
        {posts.length > 0 ? (
            <div className="flex flex-col gap-4 overflow-y-scroll" style={{ maxHeight: 'calc(100vh - 68px)', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {posts.map((post) => (
                    <PostItem key={post.id} post={post} isSelf={false} deletePost={() => {}} />
                ))}
            </div>
        ) : (
            <div className="flex flex-col gap-4 overflow-y-scroll" style={{ maxHeight: 'calc(100vh - 4rem)', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <div className="relative text-text p-2 rounded-lg border border-border shadow w-[500px] overflow-visible">
                    <div className="text-lg">
                        <span className="font-bold"> No posts to show </span>
                    </div>
                    <div className=" flex justify-between">
                        <span className="font-extralight text-text-muted text-sm"></span>
                    </div>
                </div>
            </div>
        )}
        <div className="">
            <Friends />
        </div>
    </div>
  )
}

export default ViewPosts