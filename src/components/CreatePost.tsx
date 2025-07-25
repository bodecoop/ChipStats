import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase-client";

function CreatePost() {
    const [content, setContent] = useState('');
    const [buyIn, setBuyIn] = useState<string>('');
    const [buyOut, setBuyOut] = useState<string>('');
    
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    
    const { user } = useAuth();
    
    const dateTimeLocalNow = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    const [date, setDate] = useState<Date>(new Date(dateTimeLocalNow));

    const createPost = async () => {
        try {
            setError(null);
            setLoading(true);
            if (!user) throw new Error('You must be logged in to create a post');
            if (!buyIn || !buyOut) throw new Error('You must enter a buy in and buy out amount');
            const { error } = await supabase.from('posts').insert({
                content,
                buy_in: buyIn,
                buy_out: buyOut,
                date: date
            })
            if (error) throw error

            setContent('');
            setBuyIn('');
            setBuyOut('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create post');
        } finally {
            setLoading(false);
        }
    }
    function getDifferenceString(a: string, b: string): string {
        const numA = parseFloat(a);
        const numB = parseFloat(b);

        if (isNaN(numA) || isNaN(numB)) {
            throw new Error("Both inputs must be valid numeric strings.");
        }

        const difference = Math.abs(numA - numB);

        if (numA - numB > 0) {
            return `+$${difference.toFixed(2)}`; // always returns a string like "+3.00"
        } else if (numA - numB < 0) {
            return `-$${difference.toFixed(2)}`;
        } else {
            return `$${difference.toFixed(2)}`;
        }
    }
    function handleDifferentComp({ a, b }: { a: string; b: string }) {
        const numA = parseFloat(a);
        const numB = parseFloat(b);

        const colorClass =
            (numB - numA) > 0
                ? "text-green-600"
                : (numB - numA) < 0
                    ? "text-red-600"
                    : "text-black";

        return (
            <span className={`font-semibold ${colorClass}`}>
                {getDifferenceString(b, a)}
            </span>
        );
    }

    return (
        <div className="text-lg h-fit flex flex-col bg-bg-dark/60 absolute w-full max-w-[700px] min-w-[200px] mx-auto text-text-inverse">
            <div className="text-2xl bg-bg-dark w-full py-4 text-center text-text-inverse">Create Post</div>
            <div className="flex items-center justify-start gap-8 px-8 py-4">
                 <div className="flex flex-col">
                        Time
                        <div className="flex items-center gap-2 border-border bg-bg-main border rounded-md px-4 py-0.5 max-w-[400px]">
                            <input
                                type="datetime-local"
                                defaultValue={dateTimeLocalNow}
                                className="text-text border-none outline-none placeholder:text-text-muted/50 border w-[220px] text-right focus:outline-none"
                                onChange={(e) => {
                                    setDate(new Date(e.target.value));
                                }}
                                disabled={loading} />
                        </div>
                    </div>
                <div>
                    <div className="flex flex-col">
                        Buy In
                        <div className="flex items-center gap-2 border-border bg-bg-main border rounded-md px-4 py-0.5 max-w-[200px]">
                            <input
                                type="text"
                                maxLength={7}
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                inputMode="decimal"
                                value={buyIn}
                                className="text-text border-none outline-none placeholder:text-text-muted/50 border w-[110px] text-right focus:outline-none"
                                onBlur={() => {
                                    const num = parseFloat(buyIn);
                                    if (!isNaN(num)) {
                                        setBuyIn(num.toFixed(2)); // formats to "0.00"
                                    }
                                }}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
                                        setBuyIn(value);
                                    }
                                }}
                                disabled={loading} />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        Cash Out
                        <div className="flex items-center gap-2 border-border bg-bg-main border rounded-md px-4 py-0.5 max-w-[200px]">
                            <input
                                type="text"
                                maxLength={7}
                                step="0.01"
                                min="0"
                                placeholder="0.00"
                                inputMode="decimal"
                                value={buyOut}
                                className="text-text border-none outline-none placeholder:text-text-muted/50 border w-[110px] text-right focus:outline-none"
                                onBlur={() => {
                                    const num = parseFloat(buyOut);
                                    if (!isNaN(num)) {
                                        setBuyOut(num.toFixed(2)); // formats to "0.00"
                                    }
                                }}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (/^\d*\.?\d{0,2}$/.test(value) || value === "") {
                                        setBuyOut(value);
                                    }
                                }}
                                disabled={loading} />
                        </div>
                    </div>
                </div>
                <div className="text-2xl p-8">
                    {buyIn && buyOut && (
                        handleDifferentComp({ a: buyIn, b: buyOut })
                    )}
                </div>
            </div>
            
            <div className="flex flex-col  w-full px-8 pb-8">
                Details
                <div className="flex items-center gap-2 border-border bg-bg-main border rounded-md px-4 py-0.5 w-full">
                    <textarea
                        value={content}
                        rows={3}
                        maxLength={180}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Tell us about your game"
                        className="focus:outline-none w-full text-text resize-none"
                        disabled={loading} />
                </div>
            </div>

            {error && <div className="text-danger">{error}</div>}

            {loading && <div className=" text-center">Loading...</div>}

            <button onClick={createPost}
                disabled={!buyIn || !buyOut}
                className={`flex justify-center items-center rounded-md px-4 py-2 font-medium
                                    text-text-inverse
                                    ${buyIn && buyOut ? 'bg-primary hover:bg-primary-muted' : 'bg-primary opacity-50 cursor-not-allowed'}
                        `}>
                Post
            </button>
        </div>
    );
}

export default CreatePost