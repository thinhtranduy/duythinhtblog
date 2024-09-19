import { useSession } from 'next-auth/react'
import React from 'react'
import { api } from '~/trpc/react';
import NavBar from './NavBar';
import { BiLogoGmail } from 'react-icons/bi';
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa";
import Link from 'next/link';

export default function UserPage({id} : {id: string}) {
    const {data : session} = useSession();
    const {data : user} = api.user.getUserById.useQuery(id)
    const posts = user?.posts
    return (
        <div>
            <NavBar></NavBar>
            <div className=' w-screen h-[150px] bg-black pt-5'>
               <div className='flex flex-col mx-auto gap-5'>
               <div className='relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[-3rem] bg-white w-[60%] flex flex-col gap-0 items-center justify-between rounded-lg border border-gray-200 z-0 '> 
                <div className='absolute top-2 right-2 px-4 py-4 z-10'> 
                            <button className='bg-[#3b49df] hover:bg-[#2f3ea8] text-white px-5 py-3 rounded-md'>
                                Edit profile
                            </button> 
                        </div>    
                    <div className='relative top-1/2 transform -translate-x-1 -translate-y-1/2 pt-5 z-10'>
                        {user?.image && <img src={user?.image} alt="User Image" className='rounded-full w-[9.5rem] h-[9.5rem] border-[9px] border-black' />}

                    </div>     
                    <div className='flex flex-col justify-center items-center gap-3 mx-auto mt-[-50px]'>
                        <div className='text-black font-bold text-5xl'>
                            {user?.name}
                        </div>
                        <div className='text-black text-xl'>
                            404 bio not found
                        </div>
                        <div className='flex justify-center space-between text-neutral-400 text-md'>
                            {<BiLogoGmail className='mx-2'/>}  {user?.email}
                        </div>
                    </div>
                </div>
                <div className='flex'>
                <div className='relative w-[20%] h-[100px] bottom-0 left-[20%] transform -translate-y-[-3rem] bg-white p-4 z-20 rounded-lg border border-gray-200 flex flex-col gap-4'>
                    <div className='flex justify-start items-center gap-2 text-lg text-black font-light'>
                        {<IoDocumentTextOutline/>} {user?.posts.length} posts published
                    </div>
                    <div className='flex justify-start items-center gap-2 text-lg text-black font-light'>
                        {<FaRegComment/>} 0 comments written
                    </div>
                </div>
                <div className='relative w-[41%] h-fit bottom-0 left-[20%] transform -translate-y-[-3rem]  px-4 rounded-lg bg-[#f0f0f0]'>
                    {posts?.map(post => (
                        <Link key={post.id} href={`/posts/${post.id}`}>
                            <div className='flex flex-col bg-white h-[250px] w-full gap-4 border border-gray-100 rounded-lg mb-5'>
                                <div className='flex justify-start items-center gap-3 mt-2 ml-4'>
                                    <div>{user?.image && <img src={user?.image} alt="User Image" className='w-6 h-6 rounded-md'/>}</div>
                                    <div>{<span>{user?.name}</span>}</div>
                                </div>
                                <div className='ml-16 text-3xl'>{post.title}</div>
                            </div>
                        </Link>
                    ))}
                </div>
                </div>
               </div>
            </div>
        </div>
    )
}
