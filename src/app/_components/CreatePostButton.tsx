import Link from 'next/link'
import React from 'react'

export default function CreatePostButton() {
  return (
    <Link className='flex justify-center items-center w-fit  text-[#3b49df] font-sans rounded-lg border border-[#3b49df] px-2 py-2 hover:text-white hover:bg-[#3b49df] hover:underline' href="/newpost">
        Create Post
    </Link>
  )
};