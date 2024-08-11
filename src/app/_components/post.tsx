"use client"
import { User } from '@prisma/client';
import { useSession } from 'next-auth/react';
import React from 'react';
import { api } from '~/trpc/react';


export default function Post() {
  const {data : session} = useSession();
  if (!session) {
    return <div>Loading...</div>;
  }
  const {data : post } = api.post.getLatest.useQuery();
  const { data: user } = post ? api.user.getUserById.useQuery(post.createdById) : { data: null };

  return (
    <div className="bg-white rounded-lg shadow-md h-full w-[1000px] mx-auto">
      <div>
      {post && <img src={post.image} alt={post.title} className="h-[420px] w-[1000px] rounded-t-lg" />}
      </div>
      <div className='flex justify-start gap-2 items-center mt-3 mx-3 mb-2'>
      {session.user.image && <img src={session.user.image} alt="User Image" className='rounded-full w-10 h-10'/>}
      <div className='flex flex-col justify-start'>
      <span className='font-semibold'>{user?.name}</span>
      {post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'No date available'}
      </div>
      </div>
     <div>
      <h2 className="text-3xl font-bold mb-2 text-start mx-16">{post?.title}</h2>
     </div>
    </div>
  );
}
