"use client"
import React from 'react';
import { api } from '~/trpc/react';
import { Post as PrismaPost } from '@prisma/client';
import Link from 'next/link';
import HomeIcon from './IconFolder/HomeIcon';
interface PostProps {
  post: PrismaPost;
}

export default function Post({ post }: PostProps ) {

  const { data: user } = post ? api.user.getUserById.useQuery(post.createdById) : { data: undefined };

  return (
    <div className='w-full mx-auto bg-white rounded-lg border border-gray-200 mb-3'>
      <Link href={`/posts/${post.id}`}>
        {/* <div className="bg-white h-fit w-[1000px] mx-auto mb-3"> */}
        <div>
        {post?.image ? (
            <img src={post.image} alt={post.title} className="h-[360px] w-full rounded-t-lg" />
          ) : (
            <div className='pt-3'></div>
          )}
        </div>
        <div className='w-fit'>
          <Link href={`/user/${user?.id}`}>
          <div className='flex justify-start gap-2 items-center mt-3 mx-3 mb-2'>
            {user?.image && <img src={user.image} alt="User Image" className='rounded-full w-8 h-8'/>}
            <div className='flex flex-col justify-start'>
            <div>
            <button className='hover:bg-gray-200 hover:bg-opacity-35 font-semi-bold text-md z-10'>
              {user?.name}
            </button>
            </div>
            <div className='hover:font-light'>
            {post?.createdAt 
            ? `${new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` 
            : 'No date available'}
            </div>
          </div>
          </div>
        </Link>
        </div>
      <div>
        <h2 className="text-4xl hover:text-[#2f3ea8] font-bold mb-2 text-start mx-16">{post?.title}</h2>
      </div>
      {/* </div> */}
    </Link>
    </div>
  );
}
