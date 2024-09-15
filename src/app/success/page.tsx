import React from 'react'
import LogoButton from '../_components/LogoButton'
import Link from 'next/link'

export default function page() {
  return (

    <div>
        <LogoButton></LogoButton>
        <span className='text-3xl'>Successfully Create Post</span>
        <Link href='/home'>
           <button className='border border-gray-200'>
                Return to home page
           </button>
        </Link>
    </div>

  )
}
