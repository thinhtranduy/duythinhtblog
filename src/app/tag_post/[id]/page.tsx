"use client"
import React, { useState } from 'react'
import NavBar from '~/app/_components/MenuBurger/NavBar'
import { useSearchParams } from 'next/navigation';
import { api } from '~/trpc/react';
import CreatePostButton from '~/app/_components/PostComps/CreatePostButton';
import Link from 'next/link';
import Post from '~/app/_components/PostComps/post';
import MenuBar from '~/app/_components/MenuBurger/MenuBar';


export default function TagPage({ params }: { params: { id: string } }) {
    const tagID = params.id;
    const { data: tag, isLoading, error } = api.tags.getTag.useQuery({ tagID: parseInt(tagID) });
    const [activeButton, setActiveButton] = useState('Relevant');
    const { data: posts} =  api.post.getPostsByTag.useQuery({tagId: parseInt(tagID)})

    const [menuOpen, setMenuOpen] = useState(false);
    const handleMenuToggle = () => {
      setMenuOpen(prevState => !prevState);
    };
  return (
    <div>
    <NavBar onMenuToggle={handleMenuToggle}></NavBar>
        <div className={`md:block mt-3 ${menuOpen ? 'block md:hidden' : 'hidden md:hidden'}`}>
          <MenuBar />
        </div>


    <div className='w-[80%] h-[200px] bg-white mx-auto mt-5 rounded-lg border border-gray-200 relative'>
        <div className='bg-[#3b2a5b] h-[10%] rounded-t-lg'></div> 
        <div className='flex flex-col mx-16 mt-10 text-black text-4xl'>
            {tag?.name}
            <span className='mt-10 text-lg'>Because the internet...</span>
        </div>
        <div className=' absolute top-[15%] right-2 w-[10%] mt-10'> 
            <button className='bg-[#3b49df] text-white px-4 py-2 rounded-md hover:bg-[#2f3ea8] hover:rounded-md'>Follow</button>
        </div>
    </div>
    <div className='w-[80%] mx-auto mt-10 flex gap-5'>
    <div className='w-[20%] flex flex-col gap-5' >
    <Link className='flex justify-center items-center w-fit  text-white font-sans rounded-lg bg-[#3b49df] px-2 py-2 hover:bg-[#2f3ea8]' href="/newpost">
        Create Post
    </Link>
    <hr className="my-2 border-gray-300" />
    <span className='text-lg font-bold'>submission guidelines</span>
    <p className='flex flex-col'>
        <span>Be nice.</span>
        <span>Be respectful.</span>
        <span>Assume best intentions.</span>
        <span>Be kind, rewind.</span>
    </p>
    <hr className="my-2 border-gray-300" />
    </div>
    <div className='flex flex-col w-[50%]'>
    <div className='flex justify-start gap-3 '>
        <button
          className={`text-xl px-4 py-3 hover:bg-white hover:text-[#3b49df] rounded-md ${activeButton === 'Relevant' ? 'font-bold text-black' : 'text-black font-light'}`}
          onClick={() => setActiveButton('Relevant')}
        >
          Relevant
        </button>
        <button
          className={`text-xl px-4 py-3 hover:bg-white hover:text-[#3b49df] rounded-md ${activeButton === 'Latest' ? 'font-bold text-black' : 'text-black font-light'}`}
          onClick={() => setActiveButton('Latest')}
        >
          Latest
        </button>
        <button
          className={`text-xl px-4 py-3 hover:bg-white hover:text-[#3b49df] rounded-md ${activeButton === 'Top' ? 'font-bold text-black' : 'text-black font-light'}`}
          onClick={() => setActiveButton('Top')}
        >
          Top
        </button><div>
      </div>
      </div>
      <div>
      {posts?.map(post => (
        <Post key={post.id} post={post} tag = {post.postTags}/>
      ))}
      </div>
    </div>
    <div className='text-black w-[30%]'>
        <span className='font-bold mb-5'>#discuss</span>
        {/* <hr className="my-2 border-gray-300" /> */}
    </div>

    </div>


</div>

  )
}
