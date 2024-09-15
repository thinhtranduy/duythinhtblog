import { useSession } from 'next-auth/react';
import React from 'react'
import { api } from '~/trpc/react';
import NavBar from './NavBar';


export default function PostDisplay({id}: {id: number}) {
    const {data : session} = useSession();
    const {data : post} = api.post.getByID.useQuery({id});
    const { data: user } = post ? api.user.getUserById.useQuery(post.createdById) : { data: undefined };
    if(!post){ 
        return <div>Loading...</div>;
    }
    return (
      <div>
        <NavBar></NavBar>
        <div className="bg-white rounded-lg` h-full w-[1000px] mx-auto mt-5">
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
        {post?.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'No date available'}
        </div>
        </div>
      <div className='mx-auto'>
          <div className='mx-auto'>
            <h2 className="text-5xl font-bold mb-2 text-start mx-16 pb-2">{post?.title}</h2>
          </div>
          <div dangerouslySetInnerHTML={{__html: post?.content}} className='prose mx-auto'>
            
      </div>
      </div>
      </div>
      </div>
    )
}
