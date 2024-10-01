"use client";
import React, { useRef, useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import LogOutButton from '../LogOutButton';
import UserDashBoard from '../User/UserDashBoard';
import CreatePostButton from '../PostComps/CreatePostButton';
import LogoButton from '../LogoButton';
import Notifications from '../IconFolder/Notifications';
import { api } from '~/trpc/react';
import { Post } from '@prisma/client';
import SearchIcon from '../IconFolder/SearchIcon';
import { CiMenuBurger } from "react-icons/ci";
import Link from 'next/link';
interface NavBarProps {
  onMenuToggle: () => void; 
}
const NavBar: React.FC<NavBarProps> = ({ onMenuToggle }) => {

  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [results, setResults] = useState<Post[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false); 

  const handleSearchToggle = () => {
    setIsSearchVisible(prev => !prev);
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: '2-digit' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const year = date.getFullYear().toString().slice(-2);
    return `${formattedDate} '${year}`;
  };

  const { mutateAsync: searchPosts } = api.post.getPostsBySearchTerm.useMutation({
    onSuccess: (posts) => {
      setResults(posts ?? []);
      setShowResults(posts.length > 0);
    },
    onError: (error) => {
      console.error("Error searching posts:", error);
    },
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm) {
        searchPosts({ searchTerm })
          .then(() => {
          // No action needed on success (intentionally left blank)
          })
          .catch((error) => {
            console.error("Error searching posts:", error);
          });
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);
  
    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, searchPosts]);

  const handleChange = () => {
    const term = searchInputRef.current?.value;
    setSearchTerm(term ?? '');
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      resultsRef.current &&
      !resultsRef.current.contains(event.target as Node) &&
      searchInputRef.current &&
      !searchInputRef.current.contains(event.target as Node)
    ) {
      setShowResults(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isSearchVisible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearchVisible]); 

  return (
    <div className='sticky left-0 top-0 mx-auto h-fit bg-white border border-gray-200  z-50'>
      <div className='flex justify-around mx-auto py-2 h-fit'>
        <div className='w-[50%] h-fit flex justify-start gap-4'>
          <div className='flex items-center md:hidden'  onClick={onMenuToggle}><CiMenuBurger/></div>
          <LogoButton />
          <div className=' hidden md:relative w-[80%]  border border-gray-400 rounded-lg md:flex justify-start object-contain hover:border-[#3b49df] focus-within:border-[#3b49df]'>
            <button className=' px-1 h-full hover:bg-[#3b49df] hover:opacity-20 hover:rounded-lg'>
              <SearchIcon/>
            </button>
            <input
              ref={searchInputRef}
              className='  h-full w-full px-2 border-none rounded-lg text-lg placeholder-gray-500 font-light placeholder:text-md text-black outline-none'
              type="text"
              placeholder="Search..."
              onChange={handleChange}
            />

            {showResults && (
              <div ref={resultsRef} className='  absolute left-0 top-full bg-white border border-gray-200 rounded-lg shadow-lg mt-[2px] w-full z-50'>
                {results.map((post) => (
                  <Link href={`/posts/${post.id}`}  key={post.id} className=' flex flex-col items-start p-2 hover:bg-neutral-200 cursor-pointer'>
                    <span className='font-light text-neutral-400 text-sm'>{post.createdById}</span>
                    <h4 className='font-semibold text-xl'>{post.title}</h4>
                    <span className='font-light text-neutral-400 text-sm'>{formatDate(new Date(post.createdAt))}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
        <div className='flex justify-center items-center gap-3 object-contain'>
        {/* <div className='md:hidden items-center'>
          <button className=' px-1 py-1 h-full hover:bg-[#3b49df] hover:rounded-lg'>
              <SearchIcon/>
            </button>
          </div> */}
           <div className='md:hidden items-center'>
      <button
        className='px-1 py-1 h-full hover:bg-[#3b49df] hover:rounded-lg'
        onClick={handleSearchToggle} 
      >
        <SearchIcon />
      </button>

      {isSearchVisible && ( 
        <div className='bg-neutral-100 absolute top-0 mt-[58px] right-0  w-full h-screen px-2 ' 
        >
          <div className=' relative w-full bg-white  border border-gray-400 rounded-md py-2 flex justify-start object-contain hover:border-[#3b49df] focus-within:border-[#3b49df] mb-2'>
            <button className=' px-1 h-full hover:bg-[#3b49df] hover:opacity-20 hover:rounded-lg'>
              <SearchIcon/>
            </button>
            <input
              ref={searchInputRef}
              className='  h-full w-full px-2 border-none text-lg placeholder-gray-500 font-light placeholder:text-md text-black outline-none'
              type="text"
              placeholder="Search..."
              onChange={handleChange}
            />

          {showResults && (
            <div ref={resultsRef} className='absolute left-0 top-full bg-white border border-gray-200 rounded-lg shadow-lg mt-[2px] w-full z-50'>
              {results.map((post) => (
                <Link href={`/posts/${post.id}`} key={post.id} className='flex flex-col items-start p-2 hover:bg-neutral-200 cursor-pointer'>
                  <span className='font-light text-neutral-400 text-sm'>{post.createdById}</span>
                  <h4 className='font-semibold text-xl'>{post.title}</h4>
                  <span className='font-light text-neutral-400 text-sm'>{formatDate(new Date(post.createdAt))}</span>
                </Link>
              ))}
            </div>
          )}
           </div>
          <div className='flex flex-1 flex-col justify-start'>
            <div className='flex gap-3 text-xl mb-3 '>
              <span>Most Relevant</span>
              <span>Newest</span>
              <span>Oldest</span>
            </div>
            <div className='flex gap-3 text-xl'>
              <span>Posts</span>
              <span>People</span>
              <span>Organizations</span>
              <span>Tags</span>
              <span>Comments</span>
              <span>My posts</span>
            </div>


          </div>
        </div>
      )}
    </div>
          <CreatePostButton />
          <Notifications />
          <UserDashBoard />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
