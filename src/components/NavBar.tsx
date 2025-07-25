import { useState } from 'react'
import { Link } from 'react-router'
import { BiMenu } from 'react-icons/bi'
import { useAuth } from '../context/AuthContext';

function NavBar() {
    const [mobileMenu, setMobileMenu] = useState(false);
    const { user, signOut } = useAuth();

  return (
    <div className="fixed top-0 w-full z-40 bg-bg-main border-b border-bg-neutral shadow">
        <div className="mx-auto max-w-6xl px-4">
            <div className="flex justify-between items-center h-12">
                {/* Title */}
                <Link to="/" className='text-xl font-bold'>  <span className='text-primary'>Chip Stats</span></Link>
                
                {/* Menus */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link to="/dashboard" className='text-lg font-semibold'>Dashboard</Link>
                    <Link to="/create" className='text-lg font-semibold'>Create</Link>
                </div>

                {/* Profile / Auth */}
                <div className='hidden md:flex items-center text-text'>
                    {/* if user is not null */}
                    {user ? (
                        <div className='flex items-center gap-4'>
                            {/* display profile */}
                            <Link to={`/profile/${user.id}`} className=''>{user?.user_metadata?.first_name} {user?.user_metadata?.last_name}</Link>

                            {/* logout */}
                            <button onClick={signOut} className='font-semibold border-border border hover:bg-bg-neutral px-4 py-1 rounded-sm'>Logout</button>
                        </div>
                    ) : (
                        <div>
                            {/* display auth */}
                            <Link to="/login" className='font-semibold bg-primary hover:bg-primary-muted text-text-inverse px-4 py-1 rounded-sm'>Login</Link>
                        </div>
                    )}
                </div>

                {/* Mobile Menus */}
                <div className="md:hidden flex items-center space-x-6">
                    {!user && (
                        <Link to="/login" className='font-semibold bg-primary hover:bg-primary-muted text-text-inverse px-4 py-1 rounded-sm'>Login</Link>
                    )}
                    <button onClick={() => setMobileMenu(!mobileMenu)}><BiMenu size={24} /></button>
                </div>

                {/* Mobile Menu */}
                {mobileMenu && (
                    <div className="md:hidden fixed top-[48px] right-0 flex flex-col space-y-2 bg-bg-neutral items-center">
                        <Link to="/user" className='text-lg font-semibold flex justify-center hover:bg-bg-light w-full px-4 py-2'>{user?.user_metadata?.first_name} {user?.user_metadata?.last_name}</Link>
                        <Link to="/" className='text-lg font-semibold flex justify-center hover:bg-bg-light w-full px-4 py-2'>Home</Link>
                        <Link to="/discover" className='text-lg font-semibold flex justify-center hover:bg-bg-light w-full px-4 py-2'>Discover</Link>
                    </div>
                )}
            </div>

        </div>
    </div>
  )
}

export default NavBar