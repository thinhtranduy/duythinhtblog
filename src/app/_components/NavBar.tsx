"use client"
import React from 'react'
import { FaSearch } from "react-icons/fa";
import LogOutButton from './LogOutButton';
import UserDashBoard from './UserDashBoard';
import CreatePostButton from './CreatePostButton';
import LogoButton from './LogoButton';
const NavBar = () => {
  return (
    <div className='sticky left-0 top-0 mx-auto bg-white border border-gray-200 z-50 '>
     <div className='h-16 flex justify-around mx-auto  pr-10 py-2'>
      <div className='w-[50%] h-full flex justify-start gap-4'>
       <LogoButton></LogoButton>
        <div className=' w-full bg-none border border-gray-400 rounded-lg flex justify-start object-contain hover:border-gray-600 hover:bg-none '>
          <button className='px-3 h-full hover:bg-[#3b49df] hover:opacity-20 hover:rounded-lg ' >{<FaSearch className='hover:forced-colors:blue`'  color="black" />}</button>
          <input className=' h-full w-full px-2 border-none rounded-lg text-lg  placeholder-gray-500 placeholder:text-xl text-black outline-none' type="text" placeholder="Search..." />
        </div>
      </div>
       <div className='flex justify-center gap-3 object-contain'>
        <CreatePostButton></CreatePostButton>
        <UserDashBoard></UserDashBoard>
       </div>
     </div>
    </div>
  )

}

export default NavBar