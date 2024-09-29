import React from 'react'
import LogoButton from '../_components/LogoButton'
import Link from 'next/link'

export default function page() {
  return (

    <div>
        <div className='bg-white mx-auto h-[500px] my-16 w-[30%] flex flex-col items-center justify-center rounded-lg border border-gray-100'>
        <div className='mb-5'><LogoButton/></div>
        <span className='text-2xl text-center mb-5'>Successfully Create Post</span>
            <div>
            <Link href='/home'> 
                        <button className='border border-gray-200 px-2 py-2 text-white text-xl bg-[#3b49df] hover:underline hover:bg-[#2f3ab2] rounded-lg'>
                              Return to home page
                        </button>
                      </Link>
            </div>
        </div>
    </div>

  )
}
