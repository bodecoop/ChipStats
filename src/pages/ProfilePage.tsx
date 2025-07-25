import React, { use, useEffect, useState } from 'react'
import { useParams } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../supabase-client';
import type { Post } from './ViewPosts';
import PostItem from '../components/PostItem';
import Followers from './Followers';
import UserStats from '../components/UserStats';


interface ProfileUser {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
}

export interface Follower {
    user_id: string
    following_id: string
}

export interface UserStatistics {
    games_played: number;
    wins: number;
    losses: number;
    win_percentage: number
    profit: number
}

function ProfilePage() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();

    const [profileUser, setProfileUser] = useState<ProfileUser>();
    const [followers, setFollowers] = useState<Follower[]>([]);
    const [following, setFollowing] = useState<Follower[]>([]);
    const [posts, setPosts] = useState<Post[]>([]);

    const [stats, setStats] = useState<UserStatistics>({games_played: 0, wins: 0, losses: 0, win_percentage: 0, profit: 0});

    const [showFollowers, setShowFollowers] = useState(false);
    const [showFollowing, setShowFollowing] = useState(false);

    useEffect(() => {
        fetchProfile();
        fetchUsers();
        fetchPosts();
    }, [id])

    useEffect(() => {
        calcStats();
    }, [posts])

    async function calcStats() {
        const games_played = posts.length;
        const wins = posts.filter(post => post.buy_out > post.buy_in).length;
        const losses = posts.filter(post => post.buy_out < post.buy_in).length;
        const win_percentage = games_played > 0 ? (wins / games_played) * 100 : 0;
        const profit = posts.reduce((total, post) => total + (post.buy_out - post.buy_in), 0);
        setStats({ games_played, wins, losses, win_percentage, profit });
    }

    async function fetchPosts() {
        try {
            const { data, error } = await supabase.from('posts').select('*').eq('user_id', id).order('date', { ascending: false });
            if (error) throw error;
            setPosts(data || []);
            calcStats();
        } catch (err) {
            console.error(err);
            setPosts([]);
        }
    }

    async function fetchProfile() {
        try {
            const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
            if (error) throw error;
            setProfileUser(data);
        } catch (err) {
            console.error(err);
            setProfileUser(undefined);
        }
    }
    async function fetchUsers() {
        try {
            const { data: followingData, error } = await supabase.from('user_followers').select('*').eq('user_id', id);
            if (error) throw error;
            setFollowing(followingData);
        } catch (err) {
            console.error(err);
        }

        try {
            const { data: followerData, error } = await supabase.from('user_followers').select('*').eq('following_id', id);
            if (error) throw error;
            setFollowers(followerData);
        } catch (err) {
            console.error(err);
        }
    }

    const isFollowing = () => {
        return followers.some(follower => follower.user_id === user?.id);
    }

    const handleFollow = async () => {
        if (user) {
            try {
                const { error } = await supabase.from('user_followers').insert({ user_id: user?.id, following_id: profileUser?.id });
                if (error) throw error;
                fetchUsers();
            } catch (err) {
                console.error(err);
            }
        }
    }
    const handleUnfollow = async () => {
        if (user) {
            try {
                const { error } = await supabase.from('user_followers').delete().eq('user_id', user?.id).eq('following_id', profileUser?.id);
                if (error) throw error;
                fetchUsers();
            } catch (err) {
                console.error(err);
            }
        }
    }

    return (
        <div className='text-lg flex flex-col mt-12 overflow-y-auto'>
            <div
                className={`overflow-x-hidden absolute inset-0 flex justify-end bg-black/30 z-50 transition-opacity duration-300 ${showFollowers ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setShowFollowers(false)} >
                <div
                    className={`bg-white w-80 h-full shadow-lg transform transition-transform duration-300 ease-in-out ${showFollowers ? 'translate-x-0' : 'translate-x-full'}`}
                    onClick={(e) => e.stopPropagation()} >
                    <Followers isFollowing={false} followers={followers} onClose={() => setShowFollowers(false)} />
                </div>
            </div>
            <div
                className={`overflow-x-hidden absolute inset-0 flex justify-end bg-black/30 z-50 transition-opacity duration-300 ${showFollowing ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setShowFollowing(false)} >
                <div
                    className={`bg-white w-80 h-full shadow-lg transform transition-transform duration-300 ease-in-out ${showFollowing ? 'translate-x-0' : 'translate-x-full'}`}
                    onClick={(e) => e.stopPropagation()} >
                    <Followers isFollowing={true} followers={following} onClose={() => setShowFollowing(false)} />
                </div>
            </div>
            {/* profile header */}
            <div className='p-8 flex items-center gap-x-4'>
                <div className='w-32 h-32 bg-primary rounded-full flex-shrink-0'></div>
                <div>
                    <div className="text-4xl font-bold flex items-center gap-x-8 text-text">
                        <div>
                            {profileUser?.first_name} {profileUser?.last_name}
                        </div>
                        {profileUser?.id !== user?.id && (
                            <div className='text-lg mt-2 text-text-inverse'>
                                {isFollowing() ? (
                                    <button className='border-4 border-primary text-text rounded-md px-3 hover:bg-primary/20 hover:cursor-pointer' onClick={() => handleUnfollow()}>Unfollow</button>
                                ) : (
                                    <button className='bg-primary rounded-md py-1 px-4 hover:bg-primary/80 hover:cursor-pointer' onClick={() => handleFollow()}>Follow</button>
                                )}
                            </div>
                        )}
                    </div>
                    <div className='flex gap-x-4 pt-4'>
                        <button className='hover:cursor-pointer' onClick={() => setShowFollowers(!showFollowers)}>Followers: {followers.length}</button>
                        <button className='hover:cursor-pointer' onClick={() => setShowFollowing(!showFollowing)}>Following: {following.length}</button>
                    </div>
                </div>
            </div>
            {/* body */}
            <div className='px-8 gap-8 flex justify-baseline'>
                {/* user stats */}
                <div className='text-text text-lg flex justify-center'>
                    <UserStats stats={stats} />
                </div>
                {/* user posts */}
                <div className='text-text text-lg flex justify-center'>
                    <div className="flex flex-col gap-4">
                        {posts.map((post) => (
                            <PostItem key={post.id} post={post} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage