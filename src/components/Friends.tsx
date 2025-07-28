import { useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { useAuth } from "../context/AuthContext";
import ProfileItem from "./ProfileItem";

export interface Profile {
    id: string;
    first_name: string;
    last_name: string;
}

function Friends() {

    const [users, setUsers] = useState<Profile[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchUsers();
    }, [])

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase.from('profiles').select('*');
            if (error) throw error;
            setUsers(data);
        } catch (err) {
            console.error(err);
        }
    }
    
    const { user } = useAuth();

    return (
        <div className="flex flex-col w-[400px] border border-border shadow h-[600px] rounded-lg">
            {/* header */}
            <div className="text-2xl font-semibold pt-4 pl-4">
                Find Friends
            </div>
            {/* search bar */}
            <div className="w-full h-16 text-xl flex items-center border-b border-border shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]">
                <input type="text"
                    placeholder="Search"
                    className="text-text border-none outline-none placeholder:text-text-muted/50 border 
                                w-full text-left focus:outline-none pl-4 py-2 rounded-full mx-2 bg-bg-light"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            {/* display profiles */}
            <div className="overflow-y-scroll h-full" style={{scrollbarWidth: 'thin'}}>
                {users.filter(profile => {
                    const name = profile.first_name + ' ' + profile.last_name;
                    return (
                        profile.id !== user?.id &&
                        name.toLowerCase().includes(search.toLowerCase())
                    )
                }).map(profile => (
                    <div className='text-text px-4 py-1' key={profile.id}><ProfileItem profile={profile} /></div>
                ))}
            </div>
        </div>
    )
}

export default Friends