"use client"
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { FaTwitter } from 'react-icons/fa6'
import AccountIcon from '~/app/_components/IconFolder/AccountIcon'
import Customizationicon from '~/app/_components/IconFolder/Customizationicon'
import ExtensionsIcon from '~/app/_components/IconFolder/ExtensionsIcon'
import FacebookIcon from '~/app/_components/IconFolder/FacebookIcon'
import ForemIcon from '~/app/_components/IconFolder/ForemIcon'
import GithubIcon from '~/app/_components/IconFolder/GithubIcon'
import NotificationsIcon from '~/app/_components/IconFolder/NotificationsIcon'
import OrganizationIcon from '~/app/_components/IconFolder/OrganizationIcon'
import ProfileIcon from '~/app/_components/IconFolder/ProfileIcon'
import NavBar from '~/app/_components/NavBar'
import { api } from '~/trpc/react'
import { useState } from 'react';
import { z } from "zod";
import { useForm } from 'react-hook-form';
import { generatePresignedUrl } from '~/app/helper'
import MenuBar from '~/app/_components/MenuBar'


const updateUserSchema = z.object({
  id: z.string(), 
  userName: z.string().optional(),
  website : z.string().optional(),
  location : z.string().optional(),
  bio: z.string().optional(),
  currentlyLearning: z.string().optional(),
  availableFor: z.string().optional(),
  skills: z.string().optional(),
  currentlyHacking: z.string().optional(),
  pronouns: z.string().optional(),
  work: z.string().optional(),
  education: z.string().optional(),
  brandColor: z.string().default("#000000"), 
  profileImage : z.string().optional()
});
interface UserProfileProps{
  params: {
    id: string 
  }
}

export default function ProfilePage(props : UserProfileProps) {
  const { register, handleSubmit } = useForm<UpdateUserInput>();
  const {data : user, refetch} = api.user.getUserById.useQuery(props.params.id)
  const [formData, setFormData] = useState({
    username: user?.name ?? '',
    website: user?.website ?? '',
    location: user?.location ?? '',
    bio: user?.bio ?? '',
    currentlyLearning: user?.currentlyLearning ?? '',
    availableFor: user?.availableFor ?? '',
    skills:  user?.skills ?? '',
    currentlyHacking: user?.currentlyHacking ?? '',
    pronouns: user?.pronouns ?? '',
    work : user?.work ?? '',
    education: user?.education ?? '',
    brandColor: '#000000',
    profileImage: user?.image ?? '',
  });


 
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    console.log("Input Value:", value);
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  type UpdateUserInput = z.infer<typeof updateUserSchema>;

  const { mutate: updateUser } = api.user.updateUser.useMutation({
    onSuccess: (data) => {
      console.log("User updated successfully:", data);
      setLoading(false); 
    },
    onError: (error) => {
      console.error("Error updating user:", error);
      setLoading(false); 
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const onSubmit = (data: UpdateUserInput) => {
    setLoading(true); 

    console.log("Form Data before submission:", formData);


  const updatedProfileImage = formData.profileImage ?? user?.image ?? '';
    console.log(user?.image)
    const updatedData = {
      ...formData,
      ...data,
      id: props.params.id,
      profileImage: updatedProfileImage, 
      };
  
      console.log("Updated data being submitted:", updatedData);

    updateUser(updatedData); 
  };

  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        try {
            const presignedUrl = await generatePresignedUrl(file.name, file.type);

            const response = await fetch(presignedUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to upload file to S3');
            }

            const fileUrl = `https://duythinhtbloggingbucket.s3.amazonaws.com/uploads/${file.name}`
            setFormData((prevData) => ({
                ...prevData,
                profileImage: fileUrl ?? user?.image,
            }));

            console.log("File uploaded successfully:", fileUrl);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    }
};


  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(prevState => !prevState);
  };
  return (
    <div>
      <NavBar onMenuToggle={handleMenuToggle}></NavBar>
      <div className={`md:block mt-3 ${menuOpen ? 'block md:hidden' : 'hidden md:hidden'}`}>
          <MenuBar />
        </div>
      <form onSubmit={handleSubmit(onSubmit)} className='w-[55%] mx-auto h-full flex mt-7 gap-5 '>
          <div className='flex flex-col w-[25%] h-fit'>
            <button className='w-full h-full flex object-contain gap-2 text-neutral-800  font-light  text-items-start text-md font-sans rounded-lg border-inherit px-3 py-2 my-1 hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df] hover:underline whitespace-nowrap'><ProfileIcon/> Profile</button>
            <button className='w-full h-full flex object-contain gap-2 text-neutral-800  font-light  text-items-start text-md font-sans rounded-lg border-inherit px-3 py-2 my-1 hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df] hover:underline whitespace-nowrap'> <Customizationicon/>Customization</button>
            <button className='w-full h-full flex object-contain gap-2 text-neutral-800  font-light  text-items-start text-md font-sans rounded-lg border-inherit px-3 py-2 my-1 hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df] hover:underline whitespace-nowrap'> <NotificationsIcon/>Notifications</button>
            <button className='w-full h-full flex object-contain gap-2 text-neutral-800  font-light  text-items-start text-md font-sans rounded-lg border-inherit px-3 py-2 my-1 hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df] hover:underline whitespace-nowrap'><AccountIcon/>Account</button>
            <button className='w-full h-full flex object-contain gap-2 text-neutral-800  font-light  text-items-start text-md font-sans rounded-lg border-inherit px-3 py-2 my-1 hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df] hover:underline whitespace-nowrap'><OrganizationIcon/>Organization</button>
            <button className='w-full h-full flex object-contain gap-2 text-neutral-800  font-light  text-items-start text-md font-sans rounded-lg border-inherit px-3 py-2 my-1 hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df] hover:underline whitespace-nowrap'><ExtensionsIcon/>Extensions</button>
          </div>
          <div className='w-full flex flex-col '>
              <Link href={`/user/${user?.id}`} className='text-2xl text-blue-700 font-semibold my-1 mx-1 mb-5'>
                @{user?.name}
              </Link>
              <div className='w-full text-white h-full bg-white gap-3 justify-center items-center flex flex-col rounded-lg border border-gray-300 '>
                  <button className=' px-3 py-2 rounded-lg mt-7 w-[95%] mx-auto   flex gap-2 items-center justify-center text-md bg-[#3b5998] hover:bg-opacity-95'><FacebookIcon/> Connect Facebook Account</button>
                  <button className=' px-3 py-2 rounded-lg  mt-1 w-[95%]  mx-auto flex gap-2 items-center justify-center text-md bg-green-800 hover:bg-opacity-95'><ForemIcon/> Connect Forem Account</button>
                  <button className=' px-3 py-2 rounded-lg  mt-1 w-[95%]  mx-auto flex gap-2 items-center justify-center text-md bg-[#24292e] hover:bg-opacity-95'> <GithubIcon/> Connect Github Account</button>
                  <button className=' px-3 py-2 rounded-lg  mt-1 mb-7 w-[95%]  mx-auto flex gap-2 items-center justify-center text-md bg-black hover:bg-opacity-95'><FaTwitter/> Connect Twitter (X) Account</button>
              </div>

            <div className='w-full text-white h-full bg-white justify-center  flex flex-col rounded-lg border border-gray-200 mt-5 gap-5 '>
              <span className='text-2xl mx-7 font-bold text-black mt-5 '>User</span>
              <div className='flex flex-col text-black mx-7 gap-1'>
                <span className=' text-lg'>Name</span>
                <div className=' rounded-lg px-2 py-4 text-start font-extralight text-lg border border-gray-300 hover:border-gray-400'>{user?.name}</div>
              </div>
              <div className='flex flex-col text-black mx-7 gap-1'>
                <span className=' text-lg'>Email</span>
                <div className=' rounded-lg px-2 py-4 text-start font-extralight text-lg border border-gray-300 hover:border-gray-400'>{user?.email}</div>
              </div>

              <div className='flex flex-col text-black mx-7 gap-1'>
                <span className=' text-lg'>Username</span>
                <input className=' rounded-lg px-2 py-4 text-start font-extralight text-lg border border-gray-300 hover:border-gray-400' placeholder={user?.name ?? 'Default Placeholder'}
                  type='text'
                  name='username'
                 value={formData.username}
                 onChange={handleInputChange}
                />
              </div>
              <div className='flex flex-col text-black mx-7 gap-1'>
                <span className=' text-lg'>Profile image</span>
                <div className='flex gap-2 justify-start items-center mb-10'>
                  {user?.image && <img src={user?.image} alt="User Image" className='rounded-full w-14 h-14' />}
                  <input
                      type="file"
                      id="file-upload"
                      className="border border-gray-300 px-4 py-4 w-full"
                      onChange={handleFileUpload}
                  />
                </div>
                </div>
            </div>
            <div className='w-full text-white h-full bg-white justify-center  flex flex-col rounded-lg border border-gray-200 mt-5 gap-5 '>
            <span className='text-2xl mx-7 font-bold text-black mt-5 '>Basic</span>
            <div className='flex flex-col text-black mx-7 gap-1'>
              <div className='flex flex-col text-black mx-7 gap-1'>
                <span className=' text-lg'>Website URL</span>
                <input className=' rounded-lg px-2 py-4 text-start font-extralight text-lg border border-gray-300 hover:border-gray-400 placeholder:text-black placeholder:font-light placeholder:text-md' placeholder='https://yoursite.com'
                 type='text'
                 name='website'
                 value={formData.website}
                 onChange={handleInputChange}
                />
              </div>
            </div>
            <div className='flex flex-col text-black mx-7 gap-1'>
              <div className='flex flex-col text-black mx-7 gap-1'>
                <span className=' text-lg'>Location</span>
                <input className=' rounded-lg px-2 py-4 text-start font-extralight text-lg border border-gray-300 hover:border-gray-400 placeholder:text-black placeholder:font-light placeholder:text-md' placeholder='Hanoi, Vietnam'
                  type='text'
                  name='location'
                 value={formData.location}
                 onChange={handleInputChange}
                />
              </div>
            </div>
            <div className='flex flex-col text-black mx-7 gap-1'>
              <div className='flex flex-col text-black mx-7 gap-1 mb-10'>
                <span className=' text-lg'>Bio</span>
                <input className=' rounded-lg px-2 py-4 text-start font-extralight text-lg border border-gray-300 hover:border-gray-400 placeholder:text-black placeholder:font-light placeholder:text-md' placeholder='A short bio...'
                  type='text'
                  name='bio'
                 value={formData.bio}
                 onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className='w-full text-white h-full bg-white justify-center  flex flex-col rounded-lg border border-gray-200 mt-5 gap-5 '>
            <span className='text-2xl mx-7 font-bold text-black mt-5 '>Coding</span>
            <div className='flex flex-col text-black mx-7 gap-1'>
              <div className='flex flex-col text-black mx-7 gap-1'>
                <span className=' text-lg'>Currently learning</span>
                <span className=' text-md font-light text-gray-500'>What are you learning right now? What are the new tools and languages youre picking up right now?</span>
                <input className=' rounded-lg px-2 py-4 text-start font-extralight text-lg border border-gray-300 hover:border-gray-400'
                  type='text'
                  name='currentlyLearning'
                 value={formData.currentlyLearning}
                 onChange={handleInputChange}
                />
              </div>
            </div>
            <div className='flex flex-col text-black mx-7 gap-1'>
              <div className='flex flex-col text-black mx-7 gap-1'>
                <span className=' text-lg'>Available for</span>
                <span className=' text-md font-light text-gray-500'>What kinds of collaborations or discussions are you available for? Whats a good reason to say Hey! to you these days?</span>
                <input className=' rounded-lg px-2 py-4 text-start font-extralight text-lg border border-gray-300 hover:border-gray-400'
                 type='text'
                 name='availableFor'
                value={formData.availableFor}
                onChange={handleInputChange}
                />
              </div>
            </div>
            <div className='flex flex-col text-black mx-7 gap-1'>
              <div className='flex flex-col text-black mx-7 gap-1'>
                <span className=' text-lg'>Skills/Languages</span>
                <span className=' text-md font-light text-gray-500'>What tools and languages are you most experienced with? Are you specialized or more of a generalist?</span>
                <input className=' rounded-lg px-2 py-4 text-start font-extralight text-lg border border-gray-300 hover:border-gray-400 placeholder:text-black placeholder:font-light placeholder:text-md' placeholder='Any languages, frameworks, etc. to hightlight?'
                type='text'
                name='skills'
                value={formData.skills}
                onChange={handleInputChange}
                />
              </div>
            </div>
            <div className='flex flex-col text-black mx-7 gap-1 mb-10'>
              <div className='flex flex-col text-black mx-7 gap-1'>
                <span className=' text-lg'>Currently hacking on</span>
                <span className=' text-md font-light text-gray-500'>What projects are currently occupying most of your time?</span>
                <input className=' rounded-lg px-2 py-4 text-start font-extralight text-lg border border-gray-300 hover:border-gray-400'
                type='text'
                name='currentlyHacking'
                value={formData.currentlyHacking}
                onChange={handleInputChange}
                />
              </div>
            </div>
          </div>

          <div className='w-full text-white h-full bg-white justify-center  flex flex-col rounded-lg border border-gray-300 mt-5 gap-5 '>
            <span className='text-2xl mx-7 font-bold text-black mt-5 '>Personal</span>
            <div className='flex flex-col text-black mx-7 gap-1 mb-10'>
              <div className='flex flex-col text-black mx-7 gap-1'>
                <span className=' text-lg'>Pronouns</span>
                <input className=' rounded-lg px-2 py-4 text-start font-extralight text-lg border border-gray-300 hover:border-gray-400'
                 type='text'
                 name='pronouns'
                 value={formData.pronouns}
                 onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          <div className='w-full text-white h-full bg-white justify-center  flex flex-col rounded-lg border border-gray-200 mt-5 gap-5 '>
            <span className='text-2xl mx-7 font-bold text-black mt-5 '>Work</span>
            <div className='flex flex-col text-black mx-7 gap-1 mb-10'>
              <div className='flex flex-col text-black mx-7 gap-1'>
                <span className=' text-lg'>Work</span>
                <input className=' rounded-lg px-2 py-4 text-start font-extralight text-lg border border-gray-300 hover:border-gray-400 placeholder:text-black placeholder:font-light placeholder:text-md' placeholder='What do you do? Example: CEO at ACME Inc.'
                 type='text'
                 name='work'
                 value={formData.work}
                 onChange={handleInputChange}
                
                />
              </div>
            </div>
            <div className='flex flex-col text-black mx-7 gap-1 mb-10'>
              <div className='flex flex-col text-black mx-7 gap-1'>
                <span className=' text-lg'>Education</span>
                <input className=' rounded-lg px-2 py-4 text-start font-extralight text-lg border border-gray-300 hover:border-gray-400 placeholder:text-black placeholder:font-light placeholder:text-md' placeholder='Where did you go to school?'
                 type='text'
                 name='education'
                 value={formData.education}
                 onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className='w-full text-white h-full bg-white justify-center  flex flex-col rounded-lg border border-gray-300 mt-5 gap-5 '>
            <span className='text-2xl mx-7 font-bold text-black mt-5 '>Branding</span>
            <div className='flex flex-col text-black mx-7 gap-1 mb-10'>
              <div className='flex flex-col text-black mx-7 gap-1'>
                <span className=' text-lg'>Brand colour</span>
                <span className=' text-md font-light text-gray-500'>Used for backgrounds, borders etc.</span>
                <div className="flex items-center rounded-lg px-3 py-4 text-start font-extralight text-lg border border-gray-300 hover:border-gray-400 gap-2 mb-10">
                  <div
                    className="w-10 h-10 rounded-lg ml-2 border border-gray-300"
                    style={{ backgroundColor: formData.brandColor }}
                  ></div>

                  <input
                    type="text"
                    name='brandColor'
                    className='w-full h-full !outline-none'
                    placeholder="#0000000"
                    value={formData.brandColor}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='w-full text-white h-full bg-white justify-center  flex flex-col rounded-lg border border-gray-200 mt-5 gap-5 pb-15 '>
            <button type='submit' disabled={loading} className=' px-2 py-4  mx-6 my-5 bg-[#3b49df] rounded-lg' > {loading ? 'Saving...' : 'Save Profile Information'}</button>
          </div>
          
          </div>
      </form>
    </div>
  )
}
