"use client"
import { useSession } from 'next-auth/react';
import React, { ReactNode, use, useEffect, useRef, useState } from 'react'
import { api } from '~/trpc/react';
import NavBar from './NavBar';
import Link from 'next/link';
import Reaction from './Reaction';
import CommentIcon from './CommentIcon';
import BookMarkIcon from './IconFolder/BookMarkIcon';
import CommentReactIcon from './IconFolder/CommentReactIcon';
import ReplyIcon from './IconFolder/ReplyIcon';
import CommentBox from './CommentBox';

interface TooltipProps {
  children: ReactNode;
  emojis: Record<string, string>;
}

type ReactionCount = {
  emoji: string;
  _count: { emoji: number };
};
export default function PostDisplay({ id }: { id: number }) {
  const { data: session } = useSession();
  const user = session?.user; 

  const emojiMap = {
    sparkle_heart: '/sparkle-heart-5f9bee3767e18deb1bb725290cb151c25234768a0e9a2bd39370c382d02920cf.svg',
    multi_unicorn: '/multi-unicorn-b44d6f8c23cdd00964192bedc38af3e82463978aa611b4365bd33a0f1f4f3e97.svg',
    raise_hand: '/raised-hands-74b2099fd66a39f2d7eed9305ee0f4553df0eb7b4f11b01b6b1b499973048fe5.svg',
    exploding_head: '/exploding-head-daceb38d627e6ae9b730f36a1e390fca556a4289d5a41abb2c35068ad3e2c4b5.svg',
    fire: '/fire-f60e7a582391810302117f987b22a8ef04a2fe0df7e3258a5f49332df1cec71e.svg',
  };
  const [replyingToCommentId, setReplyingToCommentId] = useState<number | null>(null);
  const handleReplyClick = (commentId: number | undefined) => {
    if (commentId !== undefined) {
        setReplyingToCommentId(commentId);
    }
};
const [reacted, setReacted] = useState<{ emoji: string; count: number }[]>([]);

  const { data: commentPost, refetch } = api.comment.getComments.useQuery({ postId: id })
  const totalCountComment = commentPost?.length;
  const { data: reactionCounts } = api.reaction.getReactionCounts.useQuery<{ emoji: string, count: number }[]>({ postId: id });
  const { data: countReacted } = api.reaction.getReactionCountsForUser.useQuery({ postId: id, userId: user?.id });

  const [counts, setCounts] = useState<Record<string, number>>({});
  useEffect(() => {
    if (reactionCounts) {
      const initialCounts = reactionCounts.reduce((acc: Record<string, number>, reaction) => {
        if (reaction.emoji && reaction.count !== undefined) {
          acc[reaction.emoji] = reaction.count;
        }
        return acc;
      }, {});
  
      setCounts(initialCounts);
    }
  }, [reactionCounts]);
  useEffect(() => {
    if (countReacted) {
      const userReactions = countReacted.map(reaction => ({
        emoji: reaction.emoji,
        count: 1 
      }));
      
      setReacted(userReactions);
  
      
      userReactions.forEach(reaction => {
        setCounts(prevCounts => ({
          ...prevCounts,
          [reaction.emoji]: (prevCounts[reaction.emoji] ?? 0) + 1
        }));
      });
    }
  }, [countReacted]);
  const { data: post } = api.post.getByID.useQuery({ id });
  const { data: author } = post ? api.user.getUserById.useQuery(post.createdById) : { data: undefined };
  const relevantPosts = author?.posts;
  const postTags = post?.postTags;
  const tagIds = postTags?.map(postTags => postTags.tagId) ?? [];
  const { data: tags, error } = api.tags.getTagsByIDs.useQuery({ tagIds });
  if (!post) {
    return <div>Loading...</div>;
  }

  const Tooltip: React.FC<TooltipProps> = ({ children, emojis }) => {
    const [isVisible, setIsVisible] = useState(false);

    const tooltipRef = useRef<HTMLDivElement>(null);
    const { mutate: saveReaction } = api.reaction.saveReaction.useMutation();
    const {mutate : removeReaction}= api.reaction.removeReaction.useMutation();


    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };
    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);


    const handleEmojiClick = (name: string) => {
      const initialCount = reactionCounts?.find(reaction => reaction.emoji === name)?.count ?? 0; 
      const currentCount = counts[name] ?? initialCount; 
    
      const hasReacted = reacted.some(reaction => reaction.emoji === name); 
    
      if (!hasReacted) {
        const newCount = currentCount + 1; 
        setCounts(prevCounts => ({
          ...prevCounts,
          [name]: newCount,
        }));
    
        saveReaction({ postId: id, emoji: name }, {
          onError: (error) => {
            console.error("Error saving reaction:", error);
          },
        });
    
        setReacted(prevReacted => [...prevReacted, { emoji: name, count: 1 }]); 
      } else {
        const newCount = currentCount > 0 ? currentCount - 1 : initialCount; 
        setCounts(prevCounts => ({
          ...prevCounts,
          [name]: newCount,
        }));
    
        removeReaction({ postId: id, emoji: name }, {
          onError: (error) => {
            console.error("Error removing reaction:", error);
          },
        });
    
        const updatedReacted = reacted.filter(reaction => reaction.emoji !== name);
        setReacted(updatedReacted);
      }
    };
    
    
    
    return (
      <div className="relative group" onMouseEnter={handleMouseEnter} ref={tooltipRef}>
        {children}
        {isVisible && (
          <div className="absolute left-0 translate-x-[23rem] -translate-y-5 flex flex-row bg-white border border-gray-300 shadow-lg py-6 rounded-3xl whitespace-nowrap">
            {Object.entries(emojis).map(([name, src]) => (
              <div key={name} className="flex flex-col items-center mx-2 p-1 hover:bg-gray-200 rounded-2xl transition">
                <img src={src} alt={name} onClick={() => handleEmojiClick(name)} className="h-10 w-10 cursor-pointer" />
                <span className="ml-1">{counts[name] ?? 0}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <NavBar></NavBar>
      <div className='w-[90%] flex gap-5'>
        <div className='w-[14%] mt-20 flex flex-col items-end relative'>
          <div className='mb-10 w-full'>
            <Tooltip emojis={emojiMap}>
              <div className="flex items-center justify-end">
                <Reaction reacted={counts} />
              </div>
            </Tooltip>
          </div>
          <div className='mb-10'>
            <CommentIcon />
          </div>
          <BookMarkIcon></BookMarkIcon>
        </div>
        <div className="bg-white rounded-lg min-h-screen h-full w-[59%] mt-3 border border-neutral-200 ">
          <div>
            {post?.image ? (
              <img src={post.image} alt={post.title} className="h-[420px] w-full rounded-t-lg mx-auto" />
            ) : (
              <></>
            )}
          </div>
          <div className='flex justify-start gap-2 items-center pt-10 mx-16 mb-10'>
            {author?.image && <img src={author.image} alt="author Image" className='rounded-full w-10 h-10' />}
            <div className='flex flex-col justify-start'>
              <span className='font-semibold'>{author?.name}</span>
              {post?.createdAt
                ? `Posted on ${new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                : 'No date available'}
            </div>
          </div>
          <div className='flex flex-wrap gap-6 items-center mx-16 mb-8'>
            {Object.entries(counts)
              .filter(([, count]) => count > 0)
              .map(([emoji, count]) => (
                <div key={emoji} className='flex items-center'>
                  <img
                    src={emojiMap[emoji as keyof typeof emojiMap]}
                    alt={emoji}
                    className='h-8 w-8'
                  />
                  <span className='ml-2 text-lg font-medium'>{count}</span>
                </div>
              ))}
          </div>
          <div className='mx-auto'>
            <div className='mx-auto'>
              <h2 className="text-5xl font-bold mb-2 text-start mx-16 pb-2">{post?.title}</h2>
              <div className='flex gap-2 mx-16 mb-10' >
                {tags?.map((postTag) => (
                  <Link href={`/tag_post/${postTag.id}`} className='hover:bg-gray-100 text-md text-black font-light px-2 py-1 rounded-lg'
                    key={postTag?.id}>#{postTag?.name}
                  </Link>
                ))}</div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: post?.content }} className='prose mx-auto mb-10'>
            </div>
            <hr className='border-[0.5px] border-gray-100 mb-10' />
            <div className='mx-16 w-full'>
              <span className='text-3xl text-black font-bold'>
                Top comments ({totalCountComment})
              </span>
              <div className='mt-5 flex w-[99.5%] gap-3'>
                <div>
                  {user?.image && <img src={user.image} alt="User Image" className='rounded-full w-10 h-10' />}
                </div>
                <CommentBox key={id} id={id}  parentId={undefined} onDismiss={() => setReplyingToCommentId(null)}></CommentBox>
              </div>



              <div className='mt-5 gap-3 flex flex-col w-[85%]'>
                {commentPost?.map((comment) => (
                  <div key={comment.id} className='flex flex-col gap-1 mb-5'>
                    <div className='flex w-full gap-2'>
                      {comment.user?.image && (
                        <img src={comment.user?.image} alt="User Image" className='rounded-full w-10 h-10' />
                      )}
                      <div className="border border-neutral-200 min-h-[100px] rounded-lg flex-1 flex flex-col">
                        <div className='flex gap-2 justify-start items-center mt-2'>
                          <span className="ml-5 text-xl font-sans font-light">{comment.user?.name}</span>
                          <span className='text-sm text-gray-400 font-light'>•</span>
                          <div className='text-sm text-gray-400 font-light'>
                            {comment?.createdAt
                              ? `${new Date(comment.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
                              : 'No date available'}
                          </div>
                        </div>
                        <div dangerouslySetInnerHTML={{ __html: comment?.text }} className='prose mx-5 mt-5 text-2xl' />
                      </div>
                    </div>
                    <div className='flex gap-2 ml-[3rem] mt-2 w-[111%]'>
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
                        <CommentBox key={id} id={id}  parentId={comment.id} onDismiss={() => setReplyingToCommentId(null)} />
                      )}
                    </div>

                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-10 mt-5">
                        {comment.replies.map((reply) => (
                          <>
                          <div key={reply.id} className='flex flex-col gap-1 mb-2'>
                            <div className='flex w-full gap-2'>
                              {reply.user?.image && (
                                <img src={reply.user?.image} alt="User Image" className='rounded-full w-8 h-8' />
                              )}
                              <div className="border border-neutral-200 min-h-[100px] rounded-lg flex-1 flex flex-col">
                                <div className='flex gap-2 justify-start items-center mt-2'>
                                  <span className="ml-5 text-md font-sans font-light">{reply.user?.name}</span>
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
                          <div className='flex gap-2 ml-[3rem] w-[111%] my-3'>
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
                            <CommentBox key={reply.id} id={id}  parentId={reply.id} onDismiss={() => setReplyingToCommentId(null)} />
                          )}
                        </div>
                        </>
                        ))}
                       
                      </div>
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4 flex-1'>
          <div className='flex flex-col bg-white mt-5 rounded-lg h-[500px] border border-gray-300'>
            <div className='bg-green-700 h-[7%] rounded-t-lg' />
            <div className='flex gap-3 items-center -translate-y-6 mx-5'>
              <Link
                href={`/user/${user?.id}`}>
                {user?.image && <img src={user.image} alt="User Image" className='rounded-full w-14 h-14' />}
              </Link>
              <span className='font-bold text-xl translate-y-4 hover:text-[#2f3ea8]'>{user?.name}</span>
            </div>
            <div className='w-[90%] mx-auto'>
              <button className=' w-full bg-[#3b49df] text-white px-5 py-2 rounded-md hover:bg-[#2f3ea8] hover:rounded-md'>Follow</button>
            </div>
            <div className='mt-5 w-[90%] mx-auto text-lg text-black font-light'>
              I am a Full-Stack Developer specialized Front-end Developer. Passionate about algorithms, data structures, and coding challenges & always ready to face new challenges.
            </div>

          </div>
          <div className='flex flex-col bg-white mt-3 h-fit pb-10 rounded-lg'>
            <span className='text-2xl mt-3 mx-5 mb-3'>More from <span className='text-2xl text-[#3b49df] hover:text-[#2f3ea8]'>{user?.name}</span> </span>

            {relevantPosts?.map(post => (
              <Link key={post.id} href={`/posts/${post.id}`}>
                <div className='flex flex-col gap-3'>
                  <div className='border-t border-gray-100 py-4'>
                    <p className='mx-5 text-start text-xl font-light hover:text-[#3b49df]'>{post?.title}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
