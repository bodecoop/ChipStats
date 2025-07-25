import { supabase } from "../supabase-client";
import { useState } from "react";

export default function Auth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [signInLoading, setSignInLoading] = useState(false);
    const [signUpLoading, setSignUpLoading] = useState(false);

    const handleSignUp = async () => {
        try {
            setError(null);
            setSignUpLoading(true);
            const { error } = await supabase.auth.signUp({
                email,
                password
            })
            if (error) throw error
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occured during sign up');
        } finally {
            setSignUpLoading(false);
        }
    }
    const handleSignIn = async () => {
        try {
            setError(null);
            setSignInLoading(true);
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            })
            if (error) throw error
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occured during sign in');
        } finally {
            setSignInLoading(false);
        }
    }

    return (
        <div>
            <h2>Sign In / Sign Up</h2>
            {error && <div className="error-message">{error}</div>}
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" disabled={signInLoading || signUpLoading} /> 
            <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" type="password" disabled={signInLoading || signUpLoading} />
            <button onClick={handleSignIn} disabled={signInLoading || signUpLoading}>{signInLoading ? 'Loading...' : 'Sign In'}</button>
            <button onClick={handleSignUp} disabled={signInLoading || signUpLoading}>{signUpLoading ? 'Loading...' : 'Sign Up'}</button>
        </div>
    )
}