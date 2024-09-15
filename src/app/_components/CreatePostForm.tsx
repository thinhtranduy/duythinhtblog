"use client"
import { useRef, useState } from 'react';
import { api } from '~/trpc/react';
import { useRouter } from 'next/navigation'; // Import the useRouter hook
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link';
import OrderedList from '@tiptap/extension-ordered-list';
import BulletList from '@tiptap/extension-bullet-list';
import Heading from '@tiptap/extension-heading';
import Blockquote from '@tiptap/extension-blockquote';
import Code from '@tiptap/extension-code';
import { BiBold, BiItalic, BiLink, BiListUl, BiListOl, BiHeading, BiCode, BiSolidQuoteAltLeft } from 'react-icons/bi';

interface CreatePostProps {
  isPreview: boolean;
}

const CreatePost = ({isPreview}: CreatePostProps) => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState<string | undefined>(undefined);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState(null);

  const formRef = useRef<HTMLFormElement | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,Link, OrderedList, BulletList, Blockquote, Code,
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
        placeholder: "Write your post content here...",
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
        class: `w-full min-h-[600px] prose prose-2xl list-disc prose-li:marker:text-black bg-white !outline-none p-6 ${isPreview ? "cursor-default" : ""}`,
      },
    },
  });

  const createPostMutation = api.post.create.useMutation();

  const handleSubmit = async (event: React.FormEvent) => {

    event.preventDefault();
    setIsLoading(true);
    try {
      let coverImageBase64: string | undefined;
      let coverImageName: string | undefined;
      let coverImageType: string | undefined;
  
      if (file) {
        const fileBuffer = await file.arrayBuffer();
        coverImageBase64 = Buffer.from(fileBuffer).toString('base64'); // Convert buffer to base64
        coverImageName = file.name;
        coverImageType = file.type;
      }
  
      const response = await createPostMutation.mutateAsync({
        title,
        content,
        coverImageBase64,
        coverImageName,
        coverImageType,
      });
    router.push('/success');
    } catch (error) {
      console.error('Post creation failed:', error);
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (imageFile) {
        URL.revokeObjectURL(imageFile);
      }
      const newImage = URL.createObjectURL(selectedFile);
      setImageFile(newImage);
      setFile(selectedFile);
    } else {
      setImageFile(undefined);
      setFile(undefined);
    }
  };

  const handleRemove = () => {
    if (imageFile) {
      URL.revokeObjectURL(imageFile);
    }
    setImageFile(undefined);
    setFile(undefined);
  };
  return (
    <div className='absolute left-[20rem] flex flex-col h-full w-[1000px] '>
      <form ref={formRef} onSubmit={handleSubmit} className='flex flex-col justify-start bg-white rounded-lg'>
        {!isPreview ? (
              <div className="relative h-auto mb-10 mx-16 pt-10">
              {imageFile && file ? (
                <div className='flex ml-32 justify-start items-center gap-[4rem]'>
                  <img src={imageFile} alt={file.name} width={100} height={100} />
                  <div className='flex items-center'>
                      <div className="relative inline-block">
                      <input
                        type="file"
                        id="file-upload"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        onChange={handleChange}
                      />
                      <label
                        htmlFor="file-upload"
                        className="mt-2 block border-[2px] border-gray-300 shadow-sm px-4 py-2 rounded-md text-md relative"
                      >
                        Change
                      </label>
                    </div>
                    
                  <button
                  onClick={handleRemove}
                  className="mt-2 bg-white text-red-500 px-4 py-2 rounded-lg text-md hover:bg-gray-100 hover:text-red-700">
                  Remove
                </button>
                </div>
                </div>
              ) : (
                <div className="relative inline-block">
                    <input
                      type="file"
                      id="file-upload"
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      onChange={handleChange}
                    />
                    <label
                      htmlFor="file-upload"
                      className="block border-2 border-gray-400 px-2 py-2 rounded-md text-xl relative"
                    >
                      Add a cover image
                    </label>
                  </div>
              )}
          </div>
          ) :(
            <div className="relative h-auto mb-10 mx-16">
              {imageFile && file ? (
                <div className='flex justify-start items-center'>
                  <img src={imageFile} alt={file.name} width={1000} height={420} />
                </div>) : (<div className="relative h-auto mx-16"/>)}
            </div>)}
        <div className='mx-16 w-fit'> 
          <textarea
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New post title here..."
            rows={2}
            required
            className="w-full placeholder:text-5xl placeholder:font-bold placeholder:text-gray-600 h-auto outline-none font-bold text-6xl"
            readOnly={isPreview}
          />
        </div>
        {!isPreview &&(
        <div className='bg-gray-100'>
          <div className='bg-gray-100 flex flex-grow py-2 gap-5 mx-16 '>
              <button type="button" className='flex rounded-lg border-inherit px-2 py-2 hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df]' onClick={() => editor?.chain().focus().toggleBold().run()}>
                <BiBold className='text-3xl'/>
              </button>
              <button type="button" className='flex rounded-lg border-inherit px-2 py-2 hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df]' onClick={() => editor?.chain().focus().toggleItalic().run()}>
                <BiItalic  className='text-3xl'/>
              </button>
              <button type="button" className='flex rounded-lg border-inherit px-2 py-2 hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df]' onClick={() => editor?.chain().focus().setLink({ href: 'https://example.com' }).run()}>
                <BiLink className='text-3xl' />
              </button>
              <button type="button" className='flex rounded-lg border-inherit px-2 py-2 hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df]' onClick={() => {editor?.chain().focus().toggleBulletList().run()}} >
                <BiListUl className='text-3xl' />
              </button>
              <button type="button" className='flex rounded-lg border-inherit px-2 py-2 hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df]' onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
                <BiListOl  className='text-3xl'/>
              </button>
              <button type="button" className='flex rounded-lg border-inherit px-2 py-2 hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df]' onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>
                <BiHeading  className='text-3xl'/>
              </button>
              <button type="button" className='flex rounded-lg border-inherit px-2 py-2 hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df]' onClick={() => editor?.chain().focus().toggleBlockquote().run()}>
                <BiSolidQuoteAltLeft />
              </button>
              <button type="button" className='flex rounded-lg border-inherit px-2 py-2 hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df]' onClick={() => editor?.chain().focus().toggleCode().run()}>
                <BiCode  className='text-3xl'/>
              </button>
            </div>
        </div>)}
        <div className='mx-16 '>
          <EditorContent 
            editor={editor} 
          />
        </div>
      </form>
    <div>
        <button
          onClick={() => formRef.current?.requestSubmit()}
          disabled={isLoading}
          className="w-fit h-fit px-5 py-3 rounded-md mt-4 text-white bg-[#3b49df] hover:underline hover:bg-[#2f3ab2]"
        >
          {isLoading ? 'Submitting...' : 'Publish'}
        </button>
      </div>
    </div>
  );}
  
  

export default CreatePost;
