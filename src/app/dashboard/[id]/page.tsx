'use client';

import { useSession } from 'next-auth/react'
import React from 'react'
import UserPage from '~/app/_components/UserPage';
import { api } from '~/trpc/react';
import UserDashBoardPage from '../../_components/UserDashBoardPage';

interface UserProfileProps{
  params: {
    id: string 
  }
}

export default function UserProfile(props : UserProfileProps) {
  const {data : session } = useSession();
  const {data : user} = api.user.getUserById.useQuery(props.params.id)
  return (

    <div>
      <UserDashBoardPage id = {user?.id ?? ""}/>
    </div>
  )
}
