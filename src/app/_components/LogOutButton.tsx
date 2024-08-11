"use client"
import React from 'react';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/' })} // Redirect to login page after logout
            className='flex items-center text-gray-500 w-full font-sans rounded-lg border-inherit px-2 py-2 hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df] hover:underline'
        >
            Sign out
        </button>
    );
}
