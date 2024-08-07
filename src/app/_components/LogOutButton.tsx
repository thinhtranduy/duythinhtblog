"use client"
import React from 'react';
import { signOut } from 'next-auth/react';

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/' })} // Redirect to login page after logout
            className="px-4 py-2 rounded-lg text-white font-medium bg-red-500 hover:bg-red-700"
        >
            Sign out
        </button>
    );
}
