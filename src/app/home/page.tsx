'use client';

import React, { useState } from 'react'
import LogOutButton from '../_components/LogOutButton'
import NavBar from '../_components/NavBar'
import { SessionProvider, useSession } from 'next-auth/react';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/trpc/react';
import Post from '../_components/post';
import MenuBar from '../_components/MenuBar';
import DicussionPost from '../_components/Discussion';

export default function HomePage() {
  const {
    data: session
  } = useSession();

  const {
    data: posts
  } = api.post.getTenLatest.useQuery()

  const [activeButton, setActiveButton] = useState('Relevant');
  return (
    <div className="min-h-screen bg-[#f0f0f0]">
  <NavBar />
  <div className='w-[80%] mx-auto flex gap-4'>
    <div className='w-[18%] '>
      <MenuBar />
    </div>

    <div className="w-[50%]  flex flex-col">
      <div className='flex justify-start gap-3 mb-3 my-5'>
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
      {posts?.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>

    <div className=" h-fit flex-1  flex flex-col my-5 border bg-white border-gray-200 rounded-lg items-start justify-start">
      <span className='text-2xl font-bold text-black py-4 ml-3'>
        Active Discussions
      </span>
      <div>
      {posts?.map(post => (
        <DicussionPost key={post.id} post={post} />
      ))}
      </div>
    </div>
  </div>
</div>

  );
};
