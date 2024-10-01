import { useSession } from 'next-auth/react';
import React, { useEffect, useRef, useState } from 'react';
import { api } from '~/trpc/react';
import NavBar from '../MenuBurger/NavBar';
import { BiLogoGmail } from 'react-icons/bi';
import { IoDocumentTextOutline } from "react-icons/io5";
import { FaRegComment } from "react-icons/fa";
import Link from 'next/link';
import BirthdayCakeIcon from '../IconFolder/BirthdayCakeIcon';
import WebsiteIcon from '../IconFolder/websiteIcon';
import EmailIcon from '../IconFolder/EmailIcon';
import MenuBar from '../MenuBurger/MenuBar';
import MenuBurger from '../MenuBurger/MenuBurger';

export default function UserPage({ id }: { id: string }) {
    const Skeleton = ({ className }: { className?: string }) => (
        <div className={`bg-gray-200 animate-pulse rounded-md ${className}`} />
    );
    const { data: session } = useSession();
    const { data: user, isLoading } = api.user.getUserById.useQuery(id);

    const posts = user?.posts;

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

  const handleMenuToggle = () => {
    setMenuOpen(prevState => !prevState);
  };
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto'; 
    }
    return () => {
      document.body.style.overflow = 'auto'; 
    };
  }, [menuOpen]);
  const handleClickOutside = (event: MouseEvent) => {
    if (menuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuOpen(false); 
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);
    return (
        <div>
            <NavBar onMenuToggle={handleMenuToggle} />
            <div className={`md:block mt-3 ${menuOpen ? 'block md:hidden' : 'hidden md:hidden'}`}>
            </div>
            {menuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 pointer-events-auto z-50" />
        )}
      <div ref={menuRef} className={`fixed bg-white rounded-lg top-0 w-[50%] h-screen left-0 z-50  overflow-y-auto md:block ${menuOpen ? 'block md:hidden' : 'hidden md:hidden'}`}>
          < MenuBurger />
        </div>
            <div className='w-full md:w-screen h-[150px] bg-black pt-5'>
                <div className='flex flex-col mx-auto gap-5'>
                    <div className='w-full relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[-3rem] bg-white md:w-[60%] flex flex-col gap-0 items-center justify-between rounded-lg border border-gray-200 z-0'>
                        <div className='absolute top-2 right-2 px-4 py-4 z-10'>
                            <Link href={`/settings/${user?.id}`} className='bg-[#3b49df] hover:bg-[#2f3ea8] text-white px-5 py-3 rounded-md'>
                                Edit profile
                            </Link>
                        </div>
                        <div className='relative top-1/2 transform -translate-x-1 -translate-y-1/2 pt-5 z-10'>
                            {isLoading ? (
                                <Skeleton className='w-[9.5rem] h-[9.5rem] rounded-full' />
                            ) : (
                                user?.image && <img src={user?.image} alt="User Image" className='w-24 h-24 rounded-full md:w-[9.5rem] md:h-[9.5rem] border-[9px] border-black' />
                            )}
                        </div>
                        <div className='w-[50%] md:w-[80%] flex flex-col justify-center items-center gap-3 mx-auto mt-[-50px]'>
                            <div className='text-sm text-black font-bold md:text-5xl'>
                                {isLoading ? <Skeleton className='w-48 h-10' /> : user?.name}
                            </div>
                            <div className='text-sm text-black md:text-xl'>
                                {isLoading ? <Skeleton className='w-64 h-6' /> : user?.bio ?? '404 bio not found'}
                            </div>
                        </div>
                        <div className=' flex flex-col justify-center md:flex md:justify-around w-[80%] gap-3 text-neutral-400 text-md my-7'>
                            <div className='flex gap-1 px-3 py-2'>
                                <BirthdayCakeIcon /> {isLoading ? <Skeleton className='w-32 h-6' /> : 'Joined on 29 Sep 2023'}
                            </div>
                            <div className='flex gap-1 px-3 py-2'>
                                <EmailIcon /> {isLoading ? <Skeleton className='w-32 h-6' /> : user?.email}
                            </div>
                            <div className='flex gap-1 px-3 py-2'>
                                <WebsiteIcon /> {isLoading ? <Skeleton className='w-32 h-6' /> : user?.website ?? 'ExampleWeb'}
                            </div>
                        </div>
                        <hr className='border-[1px] border-gray-100 w-full mb-7' />
                        <div className='flex flex-col justify-center gap-3'>
                            <span className='text-xl text-gray-500'>Pronouns</span>
                            <div className='text-lg text-gray-700 font-light mb-5 mx-auto'>
                                {isLoading ? <Skeleton className='w-32 h-6' /> : user?.pronouns ?? 'Thomas'}
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-center items-start md:w-full'>
                        <div className=' w-[20%] h-[100px] bottom-0 right-full transform -translate-y-[-3rem] bg-white p-4 z-20 rounded-lg border border-gray-200 md:flex md:flex-col gap-4 hidden '>
                            <div className='flex justify-start items-center gap-2 text-lg text-black font-light'>
                                {<IoDocumentTextOutline />} {isLoading ? <Skeleton className='w-32 h-6' /> : `${user?.posts.length} posts published`}
                            </div>
                            <div className='flex justify-start items-center gap-2 text-lg text-black font-light'>
                                {<FaRegComment />} {isLoading ? <Skeleton className='w-32 h-6' /> : `${user?.comments.length} comments written`}
                            </div>
                        </div>
                        <div className='h-full relative w-full left-0 md:h-fit md:w-[41%] bottom-0  transform -translate-y-[-3rem] px-4 rounded-lg'>
                            {isLoading ? (
                                <Skeleton className='h-64 w-full' />
                            ) : (
                                posts?.map(post => (
                                    <Link key={post.id} href={`/posts/${post.id}`}>
                                        <div className='flex flex-col bg-white h-[250px] w-full gap-4 border border-gray-100 rounded-lg mb-5'>
                                            <div className='flex justify-start items-center gap-3 mt-2 ml-4'>
                                                <div>{user?.image && <img src={user?.image} alt="User Image" className='w-6 h-6 rounded-full' />}</div>
                                                <div>{<span>{user?.name}</span>}</div>
                                            </div>
                                            <div className='text-md ml-16 md:text-3xl'>{post.title}</div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
