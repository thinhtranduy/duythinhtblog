"use client"
import { useSession } from 'next-auth/react';
import React, { ReactNode, use, useEffect, useRef, useState } from 'react'
import { api } from '~/trpc/react';
import NavBar from '../MenuBurger/NavBar';
import Link from 'next/link';
import Reaction from '../UltilsForPost/Reaction';
import CommentIcon from '../IconFolder/CommentIcon';
import BookMarkIcon from '../IconFolder/BookMarkIcon';
import CommentReactIcon from '../IconFolder/CommentReactIcon';
import ReplyIcon from '../IconFolder/ReplyIcon';
import CommentBox from '../UltilsForPost/CommentBox';
import MenuBar from '../MenuBurger/MenuBar';
import MenuBurger from '../MenuBurger/MenuBurger';
import { comment } from 'postcss';
import RenderComment from '~/app/utils';
import repliesRendering from '~/app/utils';
import RepliesRendering from '~/app/utils';

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
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(prevState => !prevState);
  };

  const menuRef = useRef<HTMLDivElement | null>(null);

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
  const postComments = commentPost?.filter((comment) => comment.parentId == null)
  const { data: reactionCounts } = api.reaction.getReactionCounts.useQuery<{ emoji: string, count: number }[]>({ postId: id });
  const { data: countReacted } = api.reaction.getReactionCountsForUser.useQuery({ postId: id, userId: user?.id });
  console.log("Total comments:",totalCountComment )
  const replies = commentPost?.map((comment) => comment.replies)
  console.log("Replies:", replies )
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
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto'; 
    }
    return () => {
      document.body.style.overflow = 'auto'; 
    };
  }, [menuOpen]);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuOpen(false); 
    }
  };
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  console.log("Counts for emoji: ",counts)

  useEffect(() => {
    if (countReacted) {
      const userReactions = countReacted.map(reaction => ({
        emoji: reaction.emoji,
        count: reaction.count
      }));
      
      setReacted(userReactions);
      
      userReactions.forEach(reaction => {
        setCounts(prevCounts => ({
          ...prevCounts,
          [reaction.emoji]: (prevCounts[reaction.emoji] ?? 0)
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
      const currentCount = initialCount; 
    
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
          <div className="absolute left-0 translate-x-[13rem] -translate-y-10 flex flex-row bg-white border border-gray-300 shadow-lg py-6 rounded-3xl whitespace-nowrap">
            {Object.entries(emojis).map(([name, src]) => (
              <div key={name} className="flex flex-col items-center mx-2 p-1 hover:bg-gray-200 rounded-2xl transition">
                <img src={src} alt={name} onClick={() => handleEmojiClick(name)} className="h-12 w-12 cursor-pointer" />
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
      <NavBar onMenuToggle={handleMenuToggle}  ></NavBar>
      {menuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 pointer-events-auto" />
        )}
      <div ref={menuRef} className={`fixed bg-white rounded-lg top-0 w-[50%] h-screen left-0 z-50  overflow-y-auto md:block ${menuOpen ? 'block md:hidden' : 'hidden md:hidden'}`}>
          < MenuBurger />
        </div>
      <div className='w-full md:w-[90%] flex gap-5'>
        <div className='hidden md:flex w-[14%] mt-20 flex-col items-end relative'>
          <div className='mb-10 w-full'>
            <Tooltip emojis={emojiMap}>
              <div className="flex items-center justify-end">
                <Reaction reacted={counts} />
              </div>
            </Tooltip>
          </div>
          <div className='mb-10'>
            <CommentIcon size='medium'/>
          </div>
          <BookMarkIcon size='medium'></BookMarkIcon>
        </div>
        <div className="w-full md:w-[59%] bg-white rounded-lg min-h-screen h-full mt-3 border border-neutral-200 ">
          <div>
            {post?.image ? (
              <img src={post.image} alt={post.title} className=" h-[200px] md:h-[300px] w-full rounded-t-lg mx-auto" />
            ) : (
              <></>
            )}
          </div>
          <div className='flex justify-start gap-2 items-center pt-10 md:mx-16 mb-10'>
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
          <div className=' w-full'>
            <div className=''>
              <h2 className="text-4xl font-bold mb-2 text-start mx-16 pb-2">{post?.title}</h2>
              <div className='flex gap-2 mx-10 mb-10' >
                {tags?.map((postTag) => (
                  <Link href={`/tag_post/${postTag.id}`} className='hover:bg-gray-100 text-md text-black font-light px-2 py-1 rounded-lg'
                    key={postTag?.id}>#{postTag?.name}
                  </Link>
                ))}</div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: post?.content }} className='prose mx-5 md:mx-auto mb-10'>
            </div>
            <hr className='border-[0.5px] border-gray-100 mb-10' />
            <div className='mx-3 md:mx-10 md:w-[90%] object-contain '>
              <span className='text-2xl text-black font-bold'>
                Top comments ({totalCountComment})
              </span>
              <div className='mt-5 flex md:w-full gap-3'>
                <div>
                  {user?.image && <img src={user.image} alt="User Image" className='rounded-full w-10 h-10' />}
                </div>
                    <div className='w-full flex-1'>
                      <CommentBox key={id} id={id}  parentId={undefined} onDismiss={() => setReplyingToCommentId(null)}></CommentBox>
                    </div>
              </div>

              <RepliesRendering postId={id}/>

              {/* <div className=' mt-5 gap-3 flex flex-col w-full '>
                { commentPost?.map((comment) => (
                  <div key={comment.id} className='flex flex-col gap-1 mb-5'>
                    <div className='flex w-full gap-2 '>
                      {comment.user?.image && (
                        <img src={comment.user?.image} alt="User Image" className='rounded-full w-10 h-10' />
                      )}
                      <div className="border border-neutral-200 min-h-[100px] rounded-lg flex-1 flex flex-col">
                        <div className='flex gap-2 justify-start items-center mt-2'>
                          <span className="ml-5 text-md font-sans font-light">{comment.user?.name}</span>
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
                              <div className="border border-neutral-200 w-[90%] min-h-[100px] rounded-lg flex-1 flex flex-col">
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
                            <CommentBox key={reply.id} id={id}  parentId={reply.id} onDismiss={() => setReplyingToCommentId(null)} />
                          )}
                        </div>
                        </>
                        
                        ))}
                       
                      </div>
                    )}
                  </div>
                ))}
              </div> */}

            </div>
          </div>
        </div>

        <div className=' hidden md:flex flex-col gap-4 flex-1'>
          <div className='flex flex-col bg-white mt-3 rounded-lg h-[500px] border border-gray-300'>
            <div  style={{ backgroundColor: author?.brandColor ?? '#000000' }} className=' h-[7%] rounded-t-lg' />
            <div className='flex gap-3 items-center -translate-y-6 mx-5'>
              <Link
                href={`/user/${author?.id}`}>
                {author?.image && <img src={author.image} alt="author Image" className='rounded-full w-14 h-14' />}
              </Link>
              <span className='font-bold text-lg translate-y-4 hover:text-[#2f3ea8]'>{author?.name}</span>
            </div>
            <div className='w-[90%] mx-auto'>
              <button className=' w-full bg-[#3b49df] text-white px-5 py-2 rounded-md hover:bg-[#2f3ea8] hover:rounded-md'>Follow</button>
            </div>
            <div className='mt-5 w-[90%] mx-auto text-sm text-black font-light'>
            {author?.bio ?? 'askdbaks'}         
            </div>

          </div>
          <div className='flex flex-col bg-white mt-3 h-fit pb-3 rounded-lg'>
            <span className='text-xl font-semibold mt-3 mx-5 mb-3'>More from <span className='text-xl text-[#3b49df] hover:text-[#2f3ea8]'>{author?.name}</span> </span>

            {relevantPosts?.map(post => (
              <Link key={post.id} href={`/posts/${post.id}`}>
                <div className='flex flex-col gap-3'>
                  <div className='border-t border-gray-50 py-4'>
                    <p className='mx-5 text-start text-md text-gray-500 hover:text-[#3b49df]'>{post?.title}</p>
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
