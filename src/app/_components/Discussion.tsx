"use client"
import React from 'react';
import { api } from '~/trpc/react';
import { Post as PrismaPost } from '@prisma/client';
import Link from 'next/link';
import HomeIcon from './IconFolder/HomeIcon';
interface PostProps {
  post: PrismaPost;
}

export default function DicussionPost({ post }: PostProps ) {

  return (
    <div className='w-full h-[100px] px-3 mx-auto bg-white border-t rounded-lg border-[1px] border-gray-50'>
        <div className='w-fit h-[20%] mt-3'>
            <Link href={`/posts/${post.id}`}>
                <span className=" flex flex-col text-xl font-light hover:text-[#2f3ea8] mb-2 text-start">{post?.title}</span>
                <span className='text-black font-light'> 0 comments</span>
            </Link>
        </div>
    </div>
  );
}
