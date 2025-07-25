import React, { lazy, useState } from 'react'
import { Link, useNavigate } from 'react-router';
import { supabase } from '../supabase-client';
import { BiEnvelope, BiLockAlt, BiLogoGoogle } from 'react-icons/bi';

function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [err, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event?.preventDefault();

        try {
            setLoading(true);
            setError(null);
            console.log({ email, password, firstName, lastName });
            
            const { data, error } = await supabase.auth.signUp({ 
                email, 
                password,
                options: {
                    data: {
                        first_name: firstName,
                        last_name: lastName,
                    },
                },
            })
            console.log({data, error});
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
        <img src="./src/assets/poker-chips.jpg" alt="poker chips" className="w-full h-full object-cover" />
        <div className="h-fit flex flex-col items-center absolute">
            <div className="text-4xl bg-bg-dark w-full py-4 text-center text-text-inverse">Sign Up</div>
            <div className="flex flex-col gap-2 text-lg px-8 py-4 bg-bg-dark/60">
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-4 text-lg">
                    <div className='flex justify-evenly gap-2'>
                        <div className="flex flex-col text-text-inverse">
                            First Name
                            <div className="flex items-center gap-2 border-border bg-bg-main border rounded-md px-4 py-0.5 max-w-[200px]">
                                <input 
                                    type="text" 
                                    placeholder="First Name" 
                                    required
                                    autoComplete="given-name"
                                    className="text-text border-none outline-none placeholder:text-text-muted"
                                    onChange={(e) => setFirstName(e.target.value)} />
                            </div>
                        </div>
                        <div className="flex flex-col text-text-inverse">
                            Last Name
                            <div className="flex items-center gap-2 border-border bg-bg-main border rounded-md px-4 py-0.5 max-w-[200px]">
                                <input 
                                    type="text" 
                                    placeholder="Last Name" 
                                    required
                                    autoComplete="family-name"
                                    className="text-text border-none outline-none placeholder:text-text-muted"
                                    onChange={(e) => setLastName(e.target.value)} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col text-text-inverse">
                        Email
                        <div className="flex items-center justify-between gap-2 border-border bg-bg-main border rounded-md px-4 py-0.5">
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
                        <div className="flex items-center justify-between gap-2 border-border bg-bg-main border rounded-md px-4 py-0.5">
                            <input 
                                type="password" 
                                placeholder="Password" 
                                required
                                autoComplete="new-password"
                                className="text-text border-none outline-none placeholder:text-text-muted min-w-[300px]"
                                onChange={(e) => setPassword(e.target.value)}/>
                            <BiLockAlt className="text-text" />
                        </div>
                    </div>

                    {err && <div className="text-danger text-center">{err}</div>}

                    {loading && <div className="text-text-inverse text-center">Loading...</div>}

                    <button type="submit" 
                            disabled={!email || !password} 
                            className={`flex justify-center items-center rounded-md px-4 py-2 font-medium
                                        text-text-inverse
                                        ${email && password ? 'bg-primary hover:bg-primary-muted' : 'bg-primary opacity-50 cursor-not-allowed'}
                            `}>
                        Sign Up
                    </button>

                </form>

                <div className="flex items-center text-white p-4">
                    <div className="flex-grow border-t border-border"></div>
                    <span className="px-4 text-sm font-semibold">or</span>
                    <div className="flex-grow border-t border-border"></div>
                </div>

                <div className="flex justify-center items-center gap-2 bg-white hover:bg-stone-200  border-white border rounded-md px-4 py-0.5 text-primary font-medium"> 
                    <BiLogoGoogle /> Sign Up With Google
                </div>

                <div className="flex flex-col items-center my-4 text-text-inverse">Already have an account? <Link to="/login" className="hover:text-bg-light font-medium">Log In</Link></div>
            </div>
        </div>
    </div>
  )
}

export default SignUp