"use client"
import React from 'react';
import { api } from '~/trpc/react';
import { Post as PrismaPost } from '@prisma/client';
import Link from 'next/link';
interface PostProps {
  post: PrismaPost;
}

export default function Post({ post }: PostProps ) {

  const { data: user } = post ? api.user.getUserById.useQuery(post.createdById) : { data: undefined };

  return (
    <Link href={`/posts/${post.id}`}>
        <div className="bg-white rounded-lg h-full w-[1000px] mx-auto mb-3">
        <div>
        {post?.image ? (
            <img src={post.image} alt={post.title} className="h-[420px] w-[1000px] rounded-t-lg" />
          ) : (
            <div className='pt-3'></div>
          )}
        </div>
        <Link href={`/user/${user?.id}`}>
        <div className='flex justify-start gap-2 items-center mt-3 mx-3 mb-2'>
          {user?.image && <img src={user.image} alt="User Image" className='rounded-full w-10 h-10'/>}
          <div className='flex flex-col justify-start'>
          <span className='font-semibold hover:text-[#2f3ea8]'>{user?.name}</span>
        {post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'No date available'}
        </div>
        </div>
        </Link>
      <div>
        <h2 className="text-3xl hover:text-[#2f3ea8] font-bold mb-2 text-start mx-16">{post?.title}</h2>
      </div>
      </div>
    </Link>
  );
}
