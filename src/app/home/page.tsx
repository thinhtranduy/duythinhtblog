'use client';

import React, { useEffect, useRef, useState } from 'react';
import LogOutButton from '../_components/LogOutButton';
import NavBar from '../_components/MenuBurger/NavBar';
import { SessionProvider, useSession } from 'next-auth/react';
import { api } from '~/trpc/react';
import Post from '../_components/PostComps/post';
import MenuBar from '../_components/MenuBurger/MenuBar';
import DiscussionPost from '../_components/PostComps/Discussion';
import MenuBurger from '../_components/MenuBurger/MenuBurger';
interface NavBarProps {
  onMenuToggle: () => void; 
}
export default function HomePage() {
  const { data: session } = useSession();
  const user = session?.user
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleMenuToggle = () => {
    setMenuOpen(prevState => !prevState);
  };

  const SkeletonPost = () => (
    <div className="animate-pulse w-full mx-auto bg-white rounded-lg border border-gray-200 mb-3">
      <div className="h-36 bg-neutral-100 rounded-t-lg mb-2"></div>
      <div className='flex justify-start gap-2 items-center mt-3 mx-3 mb-2'>
        <div className="h-8 w-8 bg-neutral-100 rounded-full"></div>
        <div className='flex flex-col justify-start'>
          <div className='h-4 bg-neutral-100 rounded w-3/4 mb-1'></div>
          <div className='h-3 bg-neutral-100 rounded w-1/2'></div>
        </div>
      </div>
      <div className="h-6 bg-neutral-100 rounded w-3/4 mx-16 mb-2"></div>
      <div className="h-4 bg-neutral-100 rounded w-1/2 mx-16 mb-2"></div>
      <div className='flex justify-between mx-16 mb-4'>
        <div className='flex w-fit px-1 py-2'>
          <div className='h-5 bg-neutral-100 rounded w-1/3'></div>
        </div>
        <div className='h-5 bg-neutral-100 rounded w-1/4 mx-3'></div>
      </div>
    </div>
  );
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
  const { data: posts, isLoading } = api.post.getTenLatest.useQuery();
  const [activeButton, setActiveButton] = useState('Relevant');
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
    <div className="min-h-screen w-full bg-neutral-100">
      <NavBar onMenuToggle={handleMenuToggle} />
      <div className='w-full md:w-[80%] mx-auto flex gap-3 relative'>
      {menuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 pointer-events-auto" />
        )}
      <div ref={menuRef} className={`fixed bg-white rounded-lg top-0 w-[50%] min-h-screen left-0 z-50  overflow-y-auto md:block ${menuOpen ? 'block md:hidden' : 'hidden md:hidden'}`}>
          < MenuBurger />
        </div>
        <div className={`hidden md:block md:w-[18%] mt-3`}>
          <MenuBar />
        </div>
        <div className="w-full md:w-[53%] mx-auto md:flex flex-col">
          <div className='flex justify-start gap-3 mb-2 mt-5'>
            <button
              className={`text-lg px-[5px] py-1 hover:bg-white hover:text-[#3b49df] rounded-lg ${activeButton === 'Relevant' ? 'font-semibold text-gray-800' : 'text-gray-800 font-light'}`}
              onClick={() => setActiveButton('Relevant')}
            >
              Relevant
            </button>
            <button
              className={`text-lg px-[5px] py-1 hover:bg-white hover:text-[#3b49df] rounded-lg ${activeButton === 'Latest' ? 'font-semibold text-gray-800' : 'text-gray-800 font-light'}`}
              onClick={() => setActiveButton('Latest')}
            >
              Latest
            </button>
            <button
              className={`text-lg px-[5px] py-1 hover:bg-white hover:text-[#3b49df] rounded-lg ${activeButton === 'Top' ? 'font-semibold text-gray-800' : 'text-gray-800 font-light'}`}
              onClick={() => setActiveButton('Top')}
            >
              Top
            </button>
          </div>
          
          {isLoading ? (
            Array.from({ length: 10 }).map((_, index) => <SkeletonPost key={index} />)
          ) : (
            posts?.map(post => (
              <Post key={post.id} post={post} tag={post.postTags} />
            ))
          )}
        </div>

        <div className=" hidden md:flex flex-col h-fit flex-1 mt-3 border bg-white border-gray-200 rounded-lg items-start justify-start">
          <span className='text-xl font-bold text-gray-800 mx-3 py-3'>
            Active discussions
          </span>
          <div className='mb-5'>
          {posts?.map(post => (
    <DiscussionPost key={post.id} post={post} />
  ))}
          </div>
        </div>
      </div>
    </div>
  );
}
