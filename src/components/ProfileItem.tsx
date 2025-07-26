import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import type { Profile } from "./Friends";
import { supabase } from "../supabase-client";
import { Link } from "react-router";


function ProfileItem({profile}: {profile: Profile}) {
    const { user } = useAuth();
    const [isFollowing, setIsFollowing] = useState(false);

    const handleFollow = async () => {
        if (user) {
            try {
                const { error } = await supabase.from('user_followers').insert({ user_id: user?.id, following_id: profile?.id });
                if (error) throw error;
                handleFollowingCheck();
            } catch (err) {
                console.error(err);
            }
        }
    }
    const handleUnfollow = async () => {
        if (user) {
            try {
                const { error } = await supabase.from('user_followers').delete().eq('user_id', user?.id).eq('following_id', profile?.id);
                if (error) throw error;
                handleFollowingCheck();
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
        const { data, error } = await supabase.from('user_followers').select('*').eq('user_id', user?.id).eq('following_id', profile?.id);
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
                <span className="font-bold p-2"><Link to={`/profile/${profile.id}`}>
                    {profile.first_name} {profile.last_name}
                </Link></span>
            </div>
            {(profile?.id !== user?.id) && (
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

export default ProfileItem