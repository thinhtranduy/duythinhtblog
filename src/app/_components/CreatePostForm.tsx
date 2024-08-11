"use client"
import { useState } from 'react';
import { api } from '~/trpc/react'; // Adjust path if needed

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const createPostMutation = api.post.create.useMutation();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      await createPostMutation.mutateAsync({ title, content, image });
      setTitle('');
      setContent('');
      setImage('');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className='absolute left-[20rem] flex flex-col  w-[50%] h-full'>
    <form onSubmit={handleSubmit} className='flex flex-col justify-start pt-10 bg-white rounded-lg'>
      <div className='ml-16'>
        <button className=" h-auto mb-10 border-2 border-gray-400 px-2 py-2 rounded-md text-xl">
          Add a cover image
        </button>
      </div>
      <div className='ml-16'>
        <textarea
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New post title here..."
          rows={2}
          required
          className="w-full placeholder:text-5xl placeholder:font-bold placeholder:text-gray-600 h-auto mb-10 outline-none"
        />
      </div>
      <div className='ml-16'>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post content here..."
          required
          className="w-full min-h-[700px] outline-none placeholder:text-2xl placeholder:text-gray-400"
        />
      </div>
    </form>


    <div>
    <button
    type="submit"
    disabled={isLoading}
    className=" w-fit  h-fit px-5 py-3 rounded-md mt-4 text-white bg-[#3b49df] hover:underline hover:bg-[#2f3ab2] "
    >
    {isLoading ? 'Submitting...' : 'Publish'}
    </button>
    </div>
    </div>
  );}
  
  

export default CreatePost;
