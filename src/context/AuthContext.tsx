import type { User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { useNavigate } from "react-router";

interface AuthContextType {
    user: User | null;
    handleSignUp: (email: string, password: string) => void;
    handleLogin: (email: string, password: string) => void;
    signOut: () => void;
    getUser: (uuid: string) => any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children} : {children: React.ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);

    // When it logs in, it looks for a session avaliable, if there is then sets user state to that object
    useEffect(() => {
        supabase.auth.getSession().then(({data: {session}}) => {
            setUser(session?.user ?? null)
        });

        const {data: listener} = supabase.auth.onAuthStateChange((_event, session) => {
            //listens to changes in state of the auth
            //if there is then we set the user in the session to the actual user
            setUser(session?.user ?? null);
        })

        //unsubscribes to the listener to prevent memory leaks
        return () => {
            listener.subscription.unsubscribe();
        }
    }, [])

    const handleSignUp = (email: string, password: string) => {
        supabase.auth.signUp({ email, password })
    }
    const handleLogin = (email: string, password: string) => {
        supabase.auth.signInWithPassword({ email, password })
    }

    const signOut = () => {
        supabase.auth.signOut()
    }

    const getUser = async (uuid: string) => {
        const { data, error } = await supabase.from('profiles').select('*').eq('id', uuid).single();
        if(error) throw error;
        return data
    }

    return <AuthContext.Provider value={{user, handleSignUp, handleLogin, signOut, getUser}}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext)
    if(context == undefined) {
        throw new Error("useAuth must be used within the AuthProvider");
    }
    return context;
}