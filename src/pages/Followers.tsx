import React from 'react'
import type { Follower } from './ProfilePage'
import { BiChevronRight } from 'react-icons/bi'
import FollowerItem from '../components/FollowerItem'

function Followers({followers, onClose, isFollowing}: {followers: Follower[], onClose: () => void, isFollowing: boolean}) {
  return (
    <div className='w-[300px] h-full bg-bg-main '>
        <div className='relative flex items-center justify-center h-12 border-b border-bg-neutral shadow'>
            <div className='absolute left-4'>
               <button className='hover:cursor-pointer mt-2' onClick={onClose}><BiChevronRight size={32}/></button>
            </div>
            <div className='text-lg font-semibold'>{isFollowing ? 'Following' : 'Followers'}</div>
        </div>
        <div className='p-2'>
            {followers.map(follower => (
                <div className='text-text' key={follower.user_id}><FollowerItem follower={follower} is_following={isFollowing} onClose={onClose} /></div>
            ))}
        </div>
    </div>
  )
}

export default Followers