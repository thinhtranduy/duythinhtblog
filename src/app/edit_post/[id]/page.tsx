
"use client"
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import CreatePost from '~/app/_components/PostComps/CreatePostForm';
import EditPost from '~/app/_components/PostComps/EditPost';
import LogoButton from '~/app/_components/LogoButton';
import { api } from '~/trpc/react';

interface EditPostProps {
    params: {
        id: string;
    };
}
const EditPostPage: React.FC<EditPostProps> = ({ params }) => {
    const router = useRouter;
    const [isPreview, setIsPreview] = useState(false);

    const { id } = params;
    if (typeof id !== 'string') {
        return <div>Loading...</div>;
    }
    const postId = parseInt(id);
    const { data: post, isLoading } = api.post.getByID.useQuery({ id: postId });
    console.log("Post id: ", post?.id)
    if (isLoading) {
        return <div>Loading post...</div>;
    }

    if (!post) {
        return <div>Post not found.</div>;
    }

    console.log("Post id: ", post.id);

    return (
        <div className='bg-neutral-100 min-h-screen'>

            <div className='relative flex justify-around mx-[-10rem] w-full'>
                <div className='flex items-center py-2 gap-3 mx-[-4rem]'>
                    <LogoButton />
                    <span className='text-xl'>Create post</span>
                </div>
                <div className='flex items-center py-2 gap-3 mr-[5rem]'>
                    <button
                        className={`text-xl flex rounded-lg border-inherit px-2 py-2 ${!isPreview
                                ? 'hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df]'
                                : ''
                            }`}
                        onClick={() => setIsPreview(false)}
                    >
                        <span className={!isPreview ? 'font-medium' : 'font-light'}>Edit</span>
                    </button>
                    <button
                        className={`text-xl flex rounded-lg border-inherit px-2 py-2 ${isPreview
                                ? 'hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df]'
                                : ''
                            }`}
                        onClick={() => setIsPreview(true)}
                    >
                        <span className={isPreview ? 'font-medium' : 'font-light'}>Preview</span>
                    </button>
                </div>
            </div>
            <EditPost postId={postId} isPreview={isPreview} oldContent={post?.content ?? ''} oldTitle={post?.title ?? ''} oldImage={post?.image ?? ''} />
        </div>
    );
}
export default EditPostPage;