'use client';

import React from 'react'
import LogOutButton from '../_components/LogOutButton'
import NavBar from '../_components/NavBar'
import { SessionProvider, useSession } from 'next-auth/react';
import { getServerAuthSession } from '~/server/auth';
import { api } from '~/trpc/react';
import Post from '../_components/post';

export default function homePage() {

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <div className="container mx-auto p-4">
        {<Post/>}
      </div>
    </div>
  );
};
