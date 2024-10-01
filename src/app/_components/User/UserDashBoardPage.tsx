"use client"
import React, { useEffect, useRef, useState } from 'react'
import NavBar from '../MenuBurger/NavBar'
import { useSession } from 'next-auth/react'
import { api } from '~/trpc/react';
import DicussionPost from '../PostComps/Discussion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import MenuBar from '../MenuBurger/MenuBar';
import MenuBurger from '../MenuBurger/MenuBurger';


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



  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto'; 
    }
    return () => {
      document.body.style.overflow = 'auto'; 
    };
  }, [menuOpen]);

  const handleMenuToggle = () => {
    setMenuOpen(prevState => !prevState);
  };
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuOpen(false); 
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);
  return (
    <div>
        <NavBar onMenuToggle={handleMenuToggle}></NavBar>
        <div className={`md:block mt-3 ${menuOpen ? 'block md:hidden' : 'hidden md:hidden'}`}>
        {menuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 pointer-events-auto" />
        )}
      <div ref={menuRef} className={`fixed bg-white rounded-lg top-0 w-[50%] h-screen left-0 z-50  overflow-y-auto md:block ${menuOpen ? 'block md:hidden' : 'hidden md:hidden'}`}>
          < MenuBurger />
        </div>
        </div>
        <div className='w-full md:w-[80%] mx-auto mt-5'>
            <h1 className='py-4 text-4xl font-bold text-black mb-3'>Dashboard</h1>
            <div className='flex flex-wrap justify-start gap-5'>
                <div className='flex flex-col px-10 py-5 bg-white w-[calc(50%-10px)] h-[110px] md:w-[25%] md:h-fit rounded-lg border border-gray-200 shadow-sm'>
                    <span className='text-4xl font-bold mb-1'>0</span>
                    <span className='text-neutral-400  text-sm md:text-lg font-light'>Total post reactions</span>
                </div>
                <div className='flex flex-col px-10 py-5 bg-white w-[calc(50%-10px)] h-[110px] md:w-[25%] md:h-fit rounded-lg border border-gray-200 shadow-sm'>
                    <span className='text-4xl font-bold mb-1'>0</span>
                    <span className='text-neutral-400 text-sm whitespace-nowrap md:text-lg font-light'>Total post comments</span>
                </div>
                <div className='flex flex-col px-10 py-5 bg-white w-[calc(50%-10px)] h-[110px] md:w-[32%] md:h-fit rounded-lg border border-gray-200 shadow-sm'>
                    <span className='text-4xl font-bold mb-1'>&lt; 500</span>
                    <span className='text-neutral-400 text-sm md:text-lg font-light'>Total post views</span>
                </div>
            </div>
            <div className='flex gap-3'>
            <div className='hidden md:flex flex-col w-[20%] h-fit items-start justify-start rounded-lg mt-3 gap-2'>
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
                <div className='hidden md:mb-5'>
                    <span className='text-2xl font-bold'>Posts</span>
                </div>
                <div className='flex flex-col bg-white w-full rounded-lg border border-gray-100'>
                {posts?.map(post => (
                        <div   key={post.id} className=' flex justify-between border-t border-gray-200 w-full hover:bg-gray-100  px-4 py-4'>
                            <Link href={`/posts/${post.id}`}><span className='text-[#3b49df] text-md md:text-xl font-semibold'>{post.title}</span></Link>
                        <div className='flex gap-2 '>
                            <button className='text-red-400 hover:bg-gray-300 rounded-md py-1 px-2' onClick={() => handleDelete(post.id)}>Delete</button>
                            <Link href={`/edit_post/${post?.id}`}  className='hover:bg-gray-300 rounded-md py-1 px-2'>Edit</Link>
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
