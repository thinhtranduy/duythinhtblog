import TiptapLink from '@tiptap/extension-link';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import OrderedList from '@tiptap/extension-ordered-list';
import BulletList from '@tiptap/extension-bullet-list';
import Heading from '@tiptap/extension-heading';
import Blockquote from '@tiptap/extension-blockquote';
import Code from '@tiptap/extension-code';
import { BiBold, BiItalic, BiLink, BiListUl, BiListOl, BiHeading, BiCode, BiSolidQuoteAltLeft } from 'react-icons/bi';
import React, { useState } from 'react';
import { api } from '~/trpc/react';
import type { QueryObserverResult } from '@tanstack/react-query';
import { TRPCClientErrorLike } from '@trpc/react-query';

interface CommentBoxProps {
    id: number;
    parentId?: number;
    onDismiss: () => void;
}

const CommentBox: React.FC<CommentBoxProps> = ({ id, parentId, onDismiss }) => {
    const { data: comments, refetch } = api.comment.getComments.useQuery({ postId: id });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isPreview, setIsPreview] = useState(false);
    const [content, setContent] = useState('');

    const submitCommentMutation = api.comment.submitComment.useMutation({
        onSuccess: (data) => {
            console.log("Comment submitted:", data);
            setContent("");
        },
        onError: (error) => {
            console.error("Error submitting comment:", error);
        },
    });

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const commentText = editor?.getHTML();
        if (!commentText?.trim()) {
            return;
        }
        setIsSubmitting(true);
        await submitCommentMutation.mutateAsync({ text: commentText, postId: id, parentId: parentId });
        await refetch();
        setContent('');
        editor?.commands.setContent('');
        setIsSubmitting(false);
    };

    const editor = useEditor({
        extensions: [
            StarterKit, TiptapLink, OrderedList, BulletList, Blockquote, Code,
            Blockquote.configure({
                HTMLAttributes: {
                    class: 'my-custom-class',
                },
            }),
            Heading.configure({
                HTMLAttributes: {
                    class: 'my-custom-class',
                },
            }),
            Placeholder.configure({
                placeholder: "Add to the discussion",
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            if (!isPreview) {
                setContent(editor.getHTML());
            }
        },
        editable: !isPreview,
        editorProps: {
            attributes: {
                class: `prose  max-w-full text-md md:w-full text-black min-h-[100px]  md:min-h-[125px] py-2 px-2 list-disc prose-li:marker:text-black font-light border border-gray-200 hover:border-[#2f3ea8] rounded-t-lg !outline-none ${isPreview ? "cursor-default" : ""}`,
            },
        },
    });

    return (
        <div className='flex-1 tiptap-editor-two w-full'>
            <div className='w-full'>
            <EditorContent editor={editor} />
            </div>
            {!isPreview && (
                <div className=' relative w-full  md:w-full border border-gray-200 hover:border-[#2f3ea8] rounded-b-lg'>
                    <div className='flex object-contain py-1 gap-3 w-fit'>
                        <button type="button" className='flex rounded-lg border-inherit px-2 py-2 hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df]' onClick={() => editor?.chain().focus().toggleBold().run()}>
                            <BiBold className='text-sm md:text-xl' />
                        </button>
                        <button type="button" className='flex rounded-lg border-inherit px-2 py-2 hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df]' onClick={() => editor?.chain().focus().toggleItalic().run()}>
                            <BiItalic className='text-sm md:text-xl' />
                        </button>
                        <button type="button" className='flex rounded-lg border-inherit px-2 py-2 hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df]' onClick={() => editor?.chain().focus().setLink({ href: 'https://example.com' }).run()}>
                            <BiLink className='text-sm md:text-xl' />
                        </button>
                        <button type="button" className='flex rounded-lg border-inherit px-2 py-2 hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df]' onClick={() => editor?.chain().focus().toggleBulletList().run()}>
                            <BiListUl className='text-sm md:text-xl' />
                        </button>
                        <button type="button" className='flex rounded-lg border-inherit px-2 py-2 hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df]' onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
                            <BiListOl className='text-sm md:text-xl' />
                        </button>
                        <button type="button" className='flex rounded-lg border-inherit px-2 py-2 hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df]' onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>
                            <BiHeading className='text-sm md:text-xl' />
                        </button>
                        <button type="button" className='flex rounded-lg border-inherit px-2 py-2 hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df]' onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
                            <BiSolidQuoteAltLeft />
                        </button>
                        <button type="button" className='flex rounded-lg border-inherit px-2 py-2 hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df]' onClick={() => editor?.chain().focus().toggleCode().run()}>
                            <BiCode className='text-sm md:text-xl' />
                        </button>
                    </div>
                </div>
            )}
            <button onClick={handleSubmit}
                type="button"
                className="mb-4 bg-[#3b49df] hover:bg-[#2f3ea8] text-white text-md px-4 py-2 rounded-lg mt-2 mr-3"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
            <button
                onClick={() => setIsPreview(!isPreview)}
                className='mb-4 bg-neutral-300 hover:bg-neutral-400 text-md text-black px-4 py-2 rounded-lg mt-2 mr-2'>
                {isPreview ? 'Continue Editing' : 'Preview'}
            </button>
            <button
                onClick={onDismiss}
                className='mb-4 bg-white hover:bg-gray-200 text-md text-black px-4 py-2 rounded-lg mt-2'>
                Dismiss
            </button>
        </div>
    );
}

export default CommentBox;
