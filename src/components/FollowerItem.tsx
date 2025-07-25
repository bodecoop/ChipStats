import React, { useEffect, useState } from 'react'
import type { Follower } from '../pages/ProfilePage'
import { supabase } from '../supabase-client';
import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';

function DisplayName({ user_id }: { user_id: string }) {
    const [name, setName] = useState('User');

    useEffect(() => {
        async function fetchName() {
            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('first_name, last_name')
                    .eq('id', user_id)
                    .single();

                if (error) throw error;
                setName(data?.first_name + ' ' + data?.last_name || 'Anonymous');
            } catch (err) {
                console.error(err);
                setName('Anonymous');
            }
        }

        fetchName();
    }, [user_id]);

    return <span>{name}</span>;
}

function FollowerItem({ follower, is_following, onClose }: { follower: Follower, is_following: boolean, onClose: () => void }) {
    const { user } = useAuth();
    const [isFollowing, setIsFollowing] = useState(false);

    const handleFollow = async () => {
        console.log(follower);
        if (user) {
            try {
                const { error } = await supabase.from('user_followers').insert({ user_id: user?.id, following_id: follower?.user_id });
                if (error) throw error;
            } catch (err) {
                console.error(err);
            }
        }
    }
    const handleUnfollow = async () => {
        if (user) {
            try {
                const { error } = await supabase.from('user_followers').delete().eq('user_id', user?.id).eq('following_id', follower?.user_id);
                if (error) throw error;
            } catch (err) {
                console.error(err);
            }
        }
    }

    const handleFollowingCheck = async () => {
        if (!user) {
            setIsFollowing(false);
            return;
        }
        const { data, error } = await supabase.from('user_followers').select('*').eq('user_id', user?.id).eq('following_id', is_following ? follower.following_id : follower.user_id);
        if (error) throw error;
        setIsFollowing(data.length > 0);
    }


    useEffect(() => {
        handleFollowingCheck();
    }, []);

    return (
        <div className='flex items-center justify-between'>
            <div className='flex items-center'>
                <div className='w-8 h-8 rounded-full bg-primary'></div>
                <span className="font-bold p-2"><Link to={`/profile/${is_following ? follower.following_id : follower.user_id}`} onClick={onClose}>
                    <DisplayName user_id={is_following ? follower.following_id : follower.user_id} />
                </Link></span>
            </div>
            {((is_following && follower?.following_id !== user?.id) || (!is_following && follower?.user_id !== user?.id)) && (
                <div className='text-lg mt-2 text-text-inverse'>
                    {isFollowing ? (
                        <button className='border-4 border-primary text-text rounded-md px-3 hover:bg-primary/20 hover:cursor-pointer' onClick={() => handleUnfollow()}>Unfollow</button>
                    ) : (
                        <button className='bg-primary rounded-md py-1 px-4 hover:bg-primary/80 hover:cursor-pointer' onClick={() => handleFollow()}>Follow</button>
                    )}
                </div>
            )}
        </div>
    )
}

export default FollowerItem