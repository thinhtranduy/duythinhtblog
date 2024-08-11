import React from 'react'
import LogoButton from '../_components/LogoButton'
import CreatePost from '../_components/CreatePostForm'

export default function Page() {
  return (  
    <div className='bg-gray-100 min-h-screen'>
      
      <div className='relative flex justify-around mx-[-10rem] w-full'>
        <div className='flex items-center py-2 gap-3 mx-[-4rem]'>
          <LogoButton />
          <span className='text-xl'>Create post</span>
        </div>
        <div className='flex items-center py-2 gap-3 mr-[5rem]'>
          <button>Edit</button>
          <button>Preview</button>
          
        </div>
      </div>    
      <CreatePost />


    </div>
  );
}

