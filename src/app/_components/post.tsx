"use client"
import React from 'react';
import { api } from '~/trpc/react';
import { Post as PrismaPost } from '@prisma/client';
import { PostTag } from '@prisma/client';
import Link from 'next/link';
import HomeIcon from './IconFolder/HomeIcon';
import CommentIcon from './CommentIcon';
import BookMarkIcon from './IconFolder/BookMarkIcon';
interface PostProps {
  post: PrismaPost;
  tag:  PostTag[];
}
const calculateReadTime = (content: string) => {
  const words = content.split(/\s+/).filter(Boolean).length; 
  const minutes = Math.ceil(words / 250);
  return minutes;
};
const emojiMap = {
  sparkle_heart: '/sparkle-heart-5f9bee3767e18deb1bb725290cb151c25234768a0e9a2bd39370c382d02920cf.svg',
  multi_unicorn: '/multi-unicorn-b44d6f8c23cdd00964192bedc38af3e82463978aa611b4365bd33a0f1f4f3e97.svg',
  raise_hand: '/raised-hands-74b2099fd66a39f2d7eed9305ee0f4553df0eb7b4f11b01b6b1b499973048fe5.svg',
  exploding_head: '/exploding-head-daceb38d627e6ae9b730f36a1e390fca556a4289d5a41abb2c35068ad3e2c4b5.svg',
  fire: '/fire-f60e7a582391810302117f987b22a8ef04a2fe0df7e3258a5f49332df1cec71e.svg',
};
export default function Post({ post, tag }: PostProps) {

  const { data: user } = post ? api.user.getUserById.useQuery(post.createdById) : { data: undefined };
  const postTags = tag; 
  const tagIds = postTags.map(postTags => postTags.tagId);
  const { data: tags, error } = api.tags.getTagsByIDs.useQuery({ tagIds });
  const { data: emojiCounts } = api.reaction.getReactionCounts.useQuery({postId : post.id});
  const totalCount = emojiCounts?.reduce((acc, { count }) => acc + count, 0) ?? 0;
  const readTime = calculateReadTime(post.content);

  return (
    <div className='w-full mx-auto bg-white rounded-lg border border-gray-200 mb-3'>
      
      <Link href={`/posts/${post.id}`}>
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
            <button className='hover:bg-gray-200 hover:bg-opacity-35 font-semi-bold text-sm text-md z-10'>
              {user?.name}
            </button>
            </div>
            <div className='hover:font-light text-sm'>
            {post?.createdAt 
            ? `${new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` 
            : 'No date available'}
            </div>
          </div>
          </div>
        </Link>
        </div>
      <div>
        <h2 className="text-[35px] hover:text-[#2f3ea8] font-bold mb-2 text-start mx-16">{post?.title}</h2>
      </div>
      <div className='flex gap-4 mx-16 mb-5' >
        {tags?.map((postTag) => (
        <Link href={{
          pathname: `/tag_post/${postTag.id}`,
        }}  className='hover:bg-gray-100 text-md text-black font-light px-2 py-1 rounded-lg'
       key={postTag?.id}>
        #{postTag?.name}
       </Link>
    ))}
      </div>
      <div className='flex justify-between mx-16  mb-4  '>
      <div className='flex w-fit px-1 py-2 '>
        {totalCount > 0 && (
          <div className='flex justify-start items-center hover:bg-gray-100 rounded-lg'>
          {emojiCounts?.filter(({ count }) => count > 0).map(({ emoji }) => (
            <div key={emoji} className='flex items-center relative mr-[-10px]'>
              <img 
                src={emojiMap[emoji as keyof typeof emojiMap]} 
                alt={emoji} 
                className='h-7 w-7 border border-gray-200 rounded-full' 
              />
            </div>
            ))}
            <div className='text-md font-light mx-3'>
              {totalCount} Reaction{totalCount !== 1 ? 's' : ''}
            </div>
            </div>
        )}
      <div className='text-sm font-light mx-10 mb-2 hover:bg-gray-100 rounded-lg px-4 py-1 flex items-center justify-center gap-2'>
          <CommentIcon></CommentIcon> Add Comments
      </div>
      </div>
      <div className='flex gap-3 justify-center items-center text-sm font-light'>
        {readTime} min read
        <BookMarkIcon></BookMarkIcon>
      </div>

      </div>

    </Link>
    </div>
  );
}
