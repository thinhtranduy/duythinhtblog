"use client"
import React, { useState } from 'react'
import NavBar from './NavBar'
import { useSession } from 'next-auth/react'
import { api } from '~/trpc/react';
import DicussionPost from './Discussion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';


export default function UserDashBoardPage({ id }: { id: string }) {
 const router = useRouter();
  const { data: session } = useSession();
  const { data: user, refetch } = api.user.getUserById.useQuery(id);
  const posts = user?.posts;
  const [activeIndex, setActiveIndex] = useState('Posts');

  const handleClick = (index: string) => {
    setActiveIndex(index);
  };

  const itemClass = 'flex justify-between w-full h-full py-2 px-4 items-start text-xl rounded-lg'; 
  const activeClass = 'bg-white text-[#3b49df]'; 
  const hoverClass = 'hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df]';
  const deletePostMutation = api.post.deletePost.useMutation({
    onSuccess:async () => {
      await refetch();
    },
    onError: (error) => {
      console.error('Failed to delete post:', error);
    },
  });
  
  const handleDelete = async (postId: number) => {
    try {
      await deletePostMutation.mutateAsync({ postId });
      
      await refetch();
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  return (
    <div>
        <NavBar></NavBar>
        <div className='w-[80%] mx-auto mt-5'>
            <h1 className='py-4 text-4xl font-bold text-black mb-3'>Dashboard</h1>
            <div className='flex justify-start gap-5'>
                <div className='flex flex-col px-10 py-10 bg-white w-[32%] h-[150px] rounded-lg border border-gray-200 shadow-sm'>
                    <span className='text-4xl font-bold mb-3'>0</span>
                    <span className='text-neutral-400 text-lg font-light'>Total post reactions</span>
                </div>
                <div className='flex flex-col px-10 py-10 bg-white w-[32%] h-[150px] rounded-lg border border-gray-200 shadow-sm'>
                    <span className='text-4xl font-bold mb-3'>0</span>
                    <span className='text-neutral-400 text-lg font-light'>Total post comments</span>
                </div>
                <div className='flex flex-col px-10 py-10 bg-white w-[32%] h-[150px] rounded-lg border border-gray-200 shadow-sm'>
                    <span className='text-4xl font-bold mb-3'>&lt; 500</span>
                    <span className='text-neutral-400 text-lg font-light'>Total post views</span>
                </div>
            </div>
            <div className='flex gap-3'>
            <div className='flex flex-col w-[20%] h-fit items-start justify-start rounded-lg mt-3 gap-2'>
                <div
                    className={`${itemClass} ${activeIndex === 'Posts' ? activeClass : hoverClass}`}
                    onClick={() => handleClick('Posts')}
                >
                    <span className={`text-lg font-light ${activeIndex === 'Posts' ? 'text-[#3b49df]' : 'text-black'}`}>
                        Posts
                    </span>
                    <span className='rounded-full bg-gray-300 text-sm p-1'>{posts?.length}</span>
                </div>
                <div
                    className={`${itemClass} ${activeIndex === 'Series' ? activeClass : hoverClass}`}
                    onClick={() => handleClick('Series')}
                >
                    <button className={`text-lg font-light ${activeIndex === 'Series' ? 'text-[#3b49df]' : 'text-black'}`}>
                        Series
                    </button>
                    <span className='rounded-full bg-gray-300 text-sm p-1'>{0}</span>
                </div>
                <div
                    className={`${itemClass} ${activeIndex === 'Followers' ? activeClass : hoverClass}`}
                    onClick={() => handleClick('Followers')}
                >
                    <button className={`text-lg font-light ${activeIndex === 'Followers' ? 'text-[#3b49df]' : 'text-black'}`}>
                        Followers
                    </button>
                    <span className='rounded-full bg-gray-300 text-sm p-1'>{0}</span>
                </div>
                <div
                    className={`${itemClass} ${activeIndex === 'Following tags' ? activeClass : hoverClass}`}
                    onClick={() => handleClick('Following tags')}
                >
                    <button className={`text-lg font-light ${activeIndex === 'Following tags' ? 'text-[#3b49df]' : 'text-black'}`}>
                        Following tags
                    </button>
                    <span className='rounded-full bg-gray-300 text-sm p-1'>{0}</span>
                </div>
                <div
                    className={`${itemClass} ${activeIndex === 'Following users' ? activeClass : hoverClass}`}
                    onClick={() => handleClick('Following users')}
                >
                    <button className={`text-lg font-light ${activeIndex === 'Following users' ? 'text-[#3b49df]' : 'text-black'}`}>
                        Following users
                    </button>
                    <span className='rounded-full bg-gray-300 text-sm p-1'>{0}</span>
                </div>
            </div>
            <div className='flex flex-col flex-1 items-start justify-start rounded-lg mt-8'>
                <div className='mb-5'>
                    <span className='text-2xl font-bold'>Posts</span>
                </div>
                <div className='flex flex-col bg-white w-full rounded-lg border border-gray-100'>
                {posts?.map(post => (
                        <div   key={post.id} className=' flex justify-between border-t border-gray-200 w-full hover:bg-gray-100  px-4 py-6'>
                            <Link href={`/posts/${post.id}`}><span className='text-[#3b49df] text-2xl font-semibold'>{post.title}</span></Link>
                        <div className='flex gap-2 '>
                            <button className='text-red-400 hover:bg-gray-300 rounded-md py-1 px-2' onClick={() => handleDelete(post.id)}>Delete</button>
                            <button className='hover:bg-gray-300 rounded-md py-1 px-2'>Edit</button>
                        </div>
                        </div>
                    ))}
                   
                </div>
            </div>
            </div>
        </div>
    </div>
  )
}
