'use client';
import React, { useState } from 'react'
import LogoButton from '../_components/LogoButton'
import CreatePost from '../_components/CreatePostForm'

export default function Page() {
  const [isPreview, setIsPreview] = useState(false);

  return (  
    <div className='bg-[#f0f0f0] min-h-screen'>
      
      <div className='relative flex justify-around mx-[-10rem] w-full'>
        <div className='flex items-center py-2 gap-3 mx-[-4rem]'>
          <LogoButton />
          <span className='text-xl'>Create post</span>
        </div>
        <div className='flex items-center py-2 gap-3 mr-[5rem]'>
              <button
            className={`text-xl flex rounded-lg border-inherit px-2 py-2 ${
              !isPreview
                ? 'hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df]'
                : ''
            }`}
            onClick={() => setIsPreview(false)}
          >
            <span className={!isPreview ? 'font-medium' : 'font-light'}>Edit</span>
          </button>
          <button
            className={`text-xl flex rounded-lg border-inherit px-2 py-2 ${
              isPreview
                ? 'hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df]'
                : ''
            }`}
            onClick={() => setIsPreview(true)}
          >
            <span className={isPreview ? 'font-medium' : 'font-light'}>Preview</span>
          </button>
        </div>
      </div>    
      <CreatePost isPreview={isPreview} />
    </div>
  );
}

