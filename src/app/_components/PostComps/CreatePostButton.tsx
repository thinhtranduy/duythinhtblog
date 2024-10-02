import Link from 'next/link'
import React from 'react'

export default function CreatePostButton() {
  return (
    <Link className='hidden md:flex justify-center items-center w-fit text-[16px]  text-[#3b49df] font-sans rounded-md border border-[#3b49df] px-3 py-[6px] hover:text-white hover:bg-[#3b49df] hover:underline' href="/newpost">
        Create Post
    </Link>
  )
};