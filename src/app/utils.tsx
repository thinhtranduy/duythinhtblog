
import CommentReactIcon from './_components/IconFolder/CommentReactIcon'
import CommentBox from './_components/UltilsForPost/CommentBox'
import ReplyIcon from './_components/IconFolder/ReplyIcon'
import { RouterOutputs, api } from '~/trpc/react'
import { useState } from 'react';
import Link from 'next/link';

type CommentResponse = RouterOutputs['comment']['getComments'][number];

export default function RepliesRendering({ postId }: { postId: number }) {
    const { data: commentPost, refetch } = api.comment.getComments.useQuery({ postId });

    const [replyingToCommentId, setReplyingToCommentId] = useState<number | null>(null);
    const handleReplyClick = (commentId: number | null) => {
        if (commentId !== null) {
            setReplyingToCommentId(commentId);
        } else {
            setReplyingToCommentId(null);
        }
  };
    if (!commentPost) {
        return null;
    }


    const commentMap = new Map<number, CommentResponse & { replies: CommentResponse[] }>();

    commentPost.forEach((comment) => {
        commentMap.set(comment.id, { ...comment, replies: [] });
    });

    commentPost.forEach((comment) => {
        if (comment.parentId !== null) {
            const parentComment = commentMap.get(comment.parentId);
            if (parentComment) {
                const commentInMap = commentMap.get(comment.id);
                if (commentInMap) {
                    parentComment.replies.push(commentInMap); 
                }
            }
        }
    });

    const topLevelComments = Array.from(commentMap.values()).filter(comment => comment.parentId === null);

    return (
        
        <div className=' mt-5 gap-3 flex flex-col w-full '>
            {topLevelComments.map(comment => (
                <div key={comment.id} className='flex flex-col gap-1 mb-5'>
                    <div className='flex w-full gap-2 '>
                     <Link href={`/user/${comment.user?.id}`}>
                     {comment.user?.image && (
                        <img src={comment.user?.image} alt="User Image" className='rounded-full w-10 h-10' />
                      )}
                     </Link>
                      <div className="border border-neutral-200 min-h-[100px] rounded-lg flex-1 flex flex-col">
                        <div className='flex gap-2 justify-start items-center mt-2'>
                          <Link href={`/user/${comment.user?.id}`} className="ml-5 text-md font-sans font-light">{comment.user?.name}</Link>
                          <span className='text-sm text-gray-400 font-light'>•</span>
                          <div className='text-sm text-gray-400 font-light'>
                            {comment?.createdAt
                              ? `${new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                              : 'No date available'}
                          </div>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: comment?.text }} className='prose max-w-full mx-5 mt-5 text-md' />
                      </div>
                    </div>
                    <div className='flex gap-2 md:ml-[3rem] mt-2  mx-[2.5rem] w-[90%] md:w-full'>
                      {replyingToCommentId !== comment.id && (
                        <>
                          <div className='hover:bg-gray-200 px-2 py-1 rounded-lg'><CommentReactIcon /></div>
                          <button
                            className='hover:bg-gray-200 flex gap-1 px-2 py-1 rounded-lg items-center'
                            onClick={() => handleReplyClick(comment.id)}
                          >
                            <ReplyIcon /> Reply
                          </button>
                        </>
                      )}
                      {replyingToCommentId === comment.id && (
                        <CommentBox key={postId} id={postId}  parentId={comment.id} onDismiss={() => setReplyingToCommentId(null)} />
                      )}
                    </div>  
                    {renderReplies(comment.replies, postId,replyingToCommentId, handleReplyClick )} 

                </div>
                
            ))}
        </div>
    );
}

function renderReplies(replies: RouterOutputs['comment']['getComments'],  postId : number, replyingToCommentId: number | null, 
        handleReplyClick: (commentId: number | null) => void ): JSX.Element | null {
   
    if (replies.length === 0) return null;
    return (
        <div style={{ paddingLeft: '20px' }}>
            {replies.map(reply => (
                <>
                <div key={reply.id} className='flex flex-col gap-1 mb-2'>
                <div className='flex w-full gap-2'>
                  {reply.user?.image && (
                    <img src={reply.user?.image} alt="User Image" className='rounded-full w-8 h-8' />
                  )}
                  <div className="border border-neutral-200 w-[90%] min-h-[100px] rounded-lg flex-1 flex flex-col">
                    <div className='flex gap-2 justify-start items-center mt-2'>
                    <Link href={`/user/${reply.user?.id}`} className="ml-5 text-md font-sans font-light">{reply.user?.name}</Link>
                      <span className='text-sm text-gray-400 font-light'>•</span>
                      <div className='text-sm text-gray-400 font-light'>
                        {reply?.createdAt
                          ? `${new Date(reply.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                          : 'No date available'}
                      </div>
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: reply?.text }} className='prose mx-5 mt-2 text-lg' />
                  </div>
                </div>
              </div>
               <div className='flex gap-2 ml-10 my-3'>
               {replyingToCommentId !== reply.id && (
                 <>
                   <div className='hover:bg-gray-200 px-2 py-1 rounded-lg'><CommentReactIcon /></div>
                   <button
                     className='hover:bg-gray-200 flex gap-1 px-2 py-1 rounded-lg items-center'
                     onClick={() => handleReplyClick(reply.id)}
                   >
                     <ReplyIcon /> Reply
                   </button>
                 </>
               )}
               {replyingToCommentId === reply.id && (
                 <CommentBox key={reply.id} id={postId}  parentId={reply.id} onDismiss={() => handleReplyClick(null)} />
               )}
             </div>
                {renderReplies(reply.replies as RouterOutputs['comment']['getComments'], postId ,replyingToCommentId, handleReplyClick)}
            </>
            ))}
        </div>
    );
}