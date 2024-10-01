"use client"
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'
import { api } from '~/trpc/react';
import Post from '../../_components/PostComps/post';
import PostDisplay from '~/app/_components/PostComps/PostDisplay';

interface PostViewProps {
    params: {
        id: string; 
    }
}

export default function PostView(props : PostViewProps) {
    // const {
    //     data: session
    //   } = useSession();
    const {data : post}  =  api.post.getByID.useQuery({id: parseInt(props.params.id)});
    if (!post) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <PostDisplay id={post.id}/>
        </div>
    )
}
