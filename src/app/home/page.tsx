'use client';

import React from 'react'
import LogOutButton from '../_components/LogOutButton'
import NavBar from '../_components/NavBar'
import { SessionProvider, useSession } from 'next-auth/react';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/trpc/react';
import Post from '../_components/post';

export default function HomePage() {
  const {
    data: session
  } = useSession();

  const {
    data: posts
  } = api.post.getTenLatest.useQuery()

  console.log(posts)
  return (
    <div className="min-h-screen bg-gray-100">
    <NavBar />
    <div className="flex flex-col mx-auto p-4 gap-5">
      {posts?.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  </div>
  );
};
