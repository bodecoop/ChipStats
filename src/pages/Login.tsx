import { useState } from "react";
import { BiEnvelope, BiLockAlt, BiLogoGoogle } from "react-icons/bi"
import { Link, useNavigate } from "react-router";
import { supabase } from "../supabase-client";
import imgUrl from '../assets/poker-chip-stacks.webp';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [err, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event?.preventDefault();

        try {
            setLoading(true);
            setError(null);
            const { error, data: {user} } = await supabase.auth.signInWithPassword({ email, password })
            console.log(user?.user_metadata?.first_name + " " + user?.user_metadata?.last_name);
            if (error) throw error
            navigate('/dashboard');
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An error occured during sign in');
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className="text-2xl flex items-center justify-center h-screen overflow-y-auto">
        <img src={imgUrl} alt="poker chips" className="w-full h-full object-cover" />
        <div className="h-fit flex flex-col items-center absolute">
            <div className="text-4xl bg-bg-dark w-full py-4 text-center text-text-inverse">Log In</div>
            <div className="flex flex-col gap-2 text-lg px-8 py-4 bg-bg-dark/60">
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4 text-lg">
                    <div className="flex flex-col text-text-inverse">
                        Email
                        <div className="flex items-center gap-2 border-border bg-bg-main border rounded-md px-4 py-0.5">
                            <input 
                                type="email" 
                                placeholder="Email address" 
                                required
                                autoComplete="email"
                                className="text-text border-none outline-none placeholder:text-text-muted min-w-[300px]"
                                onChange={(e) => setEmail(e.target.value)} />
                            <BiEnvelope className="text-text" />
                        </div>
                    </div>
                    <div className="flex flex-col text-text-inverse">
                        Password
                        <div className="flex items-center gap-2 border-border bg-bg-main border rounded-md px-4 py-0.5">
                            <input 
                                type="password" 
                                placeholder="Password" 
                                required
                                autoComplete="current-password"
                                className="text-text border-none outline-none placeholder:text-text-muted min-w-[300px]"
                                onChange={(e) => setPassword(e.target.value)}/>
                            <BiLockAlt className="text-text" />
                        </div>
                    </div>

                    {err && <div className="text-danger">{err}</div>}

                    {loading && <div className="text-text-inverse text-center">Loading...</div>}

                    <button type="submit" 
                            disabled={!email || !password} 
                            className={`flex justify-center items-center rounded-md px-4 py-2 font-medium
                                        text-text-inverse
                                        ${email && password ? 'bg-primary hover:bg-primary-muted' : 'bg-primary opacity-50 cursor-not-allowed'}
                            `}>
                        Log In
                    </button>

                </form>

                <div className="flex items-center text-white p-4">
                    <div className="flex-grow border-t border-border"></div>
                    <span className="px-4 text-sm font-semibold">or</span>
                    <div className="flex-grow border-t border-border"></div>
                </div>

                <div className="flex justify-center items-center gap-2 bg-white hover:bg-stone-200  border-white border rounded-md px-4 py-0.5 text-primary font-medium"> 
                    <BiLogoGoogle /> Sign In With Google
                </div>

                <div className="flex flex-col items-center my-4 text-text-inverse">Dont have an account? <Link to="/signup" className="hover:text-primary-muted font-medium">Sign Up</Link></div>
            </div>
        </div>
    </div>
  )
}

export default Login