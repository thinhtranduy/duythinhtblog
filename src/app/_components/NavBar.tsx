"use client";
import React, { useRef, useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import LogOutButton from './LogOutButton';
import UserDashBoard from './UserDashBoard';
import CreatePostButton from './CreatePostButton';
import LogoButton from './LogoButton';
import Notifications from './IconFolder/Notifications';
import { api } from '~/trpc/react';
import { Post } from '@prisma/client';

const NavBar = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const [results, setResults] = useState<Post[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

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
    }, 300); // Delay of 300ms
  
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

  return (
    <div className='sticky left-0 top-0 mx-auto bg-white border border-gray-200 z-50'>
      <div className='h-16 flex justify-around mx-auto pr-10 py-2'>
        <div className='w-[50%] h-full flex justify-start gap-4'>
          <LogoButton />
          <div className='relative w-[80%] bg-none border border-gray-400 rounded-lg flex justify-start object-contain hover:border-[#3b49df] focus-within:border-[#3b49df]'>
            <button className='px-3 h-full hover:bg-[#3b49df] hover:opacity-20 hover:rounded-lg'>
              <FaSearch className='hover:forced-colors:blue' color="black" />
            </button>
            <input
              ref={searchInputRef}
              className='h-full w-full px-2 border-none rounded-lg text-lg placeholder-gray-500 font-light placeholder:text-xl text-black outline-none'
              type="text"
              placeholder="Search..."
              onChange={handleChange}
            />
            {showResults && (
              <div ref={resultsRef} className='absolute left-0 top-full z-10 bg-white border border-gray-200 rounded-lg shadow-lg mt-[2px] w-full'>
                {results.map((post) => (
                  <div key={post.id} className='p-2 hover:bg-neutral-200 cursor-pointer'>
                    <span className='font-light text-neutral-400 text-sm'>{post.createdById}</span>
                    <h4 className='font-semibold text-xl'>{post.title}</h4>
                    <span className='font-light text-neutral-400 text-sm'>{formatDate(new Date(post.createdAt))}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className='flex justify-center items-center gap-3 object-contain'>
          <CreatePostButton />
          <Notifications />
          <UserDashBoard />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
