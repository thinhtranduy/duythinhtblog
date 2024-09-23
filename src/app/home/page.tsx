'use client';

import React, { useState } from 'react';
import LogOutButton from '../_components/LogOutButton';
import NavBar from '../_components/NavBar';
import { SessionProvider, useSession } from 'next-auth/react';
import { api } from '~/trpc/react';
import Post from '../_components/post';
import MenuBar from '../_components/MenuBar';
import DiscussionPost from '../_components/Discussion';

export default function HomePage() {
  const { data: session } = useSession();

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

  const { data: posts, isLoading } = api.post.getTenLatest.useQuery();

  const [activeButton, setActiveButton] = useState('Relevant');

  return (
    <div className="min-h-screen bg-[#f0f0f0]">
      <NavBar />
      <div className='w-[80%] mx-auto flex gap-4'>
        <div className='w-[18%]'>
          <MenuBar />
        </div>

        <div className="w-[54%] flex flex-col">
          <div className='flex justify-start gap-3 mb-3 my-3'>
            <button
              className={`text-xl px-4 py-3 hover:bg-white hover:text-[#3b49df] rounded-md ${activeButton === 'Relevant' ? 'font-bold text-black' : 'text-black font-light'}`}
              onClick={() => setActiveButton('Relevant')}
            >
              Relevant
            </button>
            <button
              className={`text-xl px-4 py-3 hover:bg-white hover:text-[#3b49df] rounded-md ${activeButton === 'Latest' ? 'font-bold text-black' : 'text-black font-light'}`}
              onClick={() => setActiveButton('Latest')}
            >
              Latest
            </button>
            <button
              className={`text-xl px-4 py-3 hover:bg-white hover:text-[#3b49df] rounded-md ${activeButton === 'Top' ? 'font-bold text-black' : 'text-black font-light'}`}
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

        <div className="h-fit flex-1 flex flex-col my-5 border bg-white border-gray-200 rounded-lg items-start justify-start">
          <span className='text-2xl font-bold text-black py-4 ml-3'>
            Active Discussions
          </span>
          <div>
          {posts?.map(post => (
    <DiscussionPost key={post.id} post={post} />
  ))}
          </div>
        </div>
      </div>
    </div>
  );
}
