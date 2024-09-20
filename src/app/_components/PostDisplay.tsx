import { useSession } from 'next-auth/react';
import React from 'react'
import { api } from '~/trpc/react';
import NavBar from './NavBar';
import { useRouter } from 'next/navigation'; // Import the useRouter hook
import Link from 'next/link';


export default function PostDisplay({id}: {id: number}) {
    const {data : session} = useSession();
    const {data : post} = api.post.getByID.useQuery({id});
    const { data: user } = post ? api.user.getUserById.useQuery(post.createdById) : { data: undefined };
    const postTags = post?.postTags;
    const tagIds = postTags?.map(postTags => postTags.tagId) ?? [];
    const { data: tags, error } = api.tags.getTagsByIDs.useQuery({ tagIds });
    if(!post){ 
        return <div>Loading...</div>;
    }

    return (
      <div>
        <NavBar></NavBar>
        <div className="bg-white rounded-lg` min-h-screen h-full w-[1000px] mx-auto mt-5">
        <div>
        {post?.image ? (
            <img src={post.image} alt={post.title} className="h-[420px] w-[1000px] rounded-t-lg mx-auto" />
          ) : (
            <></>
          )}
        </div>
        <div className='flex justify-start gap-2 items-center mt-3 mx-3 mb-2'>
        {user?.image && <img src={user.image} alt="User Image" className='rounded-full w-10 h-10'/>}
        <div className='flex flex-col justify-start'>
        <span className='font-semibold'>{user?.name}</span>
        {post?.createdAt 
          ? `Posted on ${new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}` 
          : 'No date available'}        
        </div>
        </div>
      <div className='mx-auto'>
          <div className='mx-auto'>
            <h2 className="text-5xl font-bold mb-2 text-start mx-16 pb-2">{post?.title}</h2>
            <div className='flex gap-2 mx-16 mb-10' >
        {tags?.map((postTag) => (
      <Link href={`/tag_post/${postTag.id}`} className='hover:bg-gray-100 text-md text-black font-light px-2 py-1 rounded-lg'
      key={postTag?.id}>#{postTag?.name}
      </Link>
    ))}</div>
          </div>
          <div dangerouslySetInnerHTML={{__html: post?.content}} className='prose mx-auto'>
      </div>
      </div>
      </div>
      </div>
    )
}
