// app/dashboard/page.js
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useState } from 'react';
import LogOutButton from '../LogOutButton';
import Link from 'next/link';


export default function UserDashBoard() {
  const { data: session } = useSession();
  const user = session?.user;
  console.log(user)
  const [isDashboardVisible, setIsDashboardVisible] = useState(false);
  if (!session) {
    return <div>Loading...</div>;
  }
  const toggleDashboard = () => {
    setIsDashboardVisible(prevState => !prevState);
  };


  return (
    <div className='relative inline-block'>
        <button onClick={toggleDashboard} className='rounded-full hover:border-2 hover:border-gray-400 hover:shadow hover:shadow-gray-200'>
        {user?.image && <img src={user?.image} alt="User Image" className='rounded-full w-8 h-8'/>}
      </button>
      {isDashboardVisible && (
        <div className='fixed w-full top-0 right-0  md:fixed md:top-0 md:right-44 mt-[58px]  md:w-64 p-4 border border-gray-300 rounded-lg shadow-lg bg-white gap-2' style={{ zIndex: 9999 }}>

            <Link 
            href={`/user/${user?.id}`}
            className='flex text-gray-500 w-full font-sans rounded-lg border-inherit px-2 py-2 hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df] hover:underline'>
              <button >
                    {user?.name}
              </button>
        
            </Link>
                    <hr className='border-gray-300 flex-grow w-full'/>

                    <Link href={`/dashboard/${user?.id}`}
                    className='flex text-gray-500 w-full font-sans rounded-lg border-inherit px-2 py-2 hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df] hover:underline'>
                        <button>
                            Dashboard
                        </button>
                      </Link>
                    
                   
                        <Link href='/newpost' className='flex text-gray-500 w-full font-sans rounded-lg border-inherit px-2 py-2 hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df] hover:underline'>
                          <button>
                              Create Post
                        </button>
                        </Link>

                      <Link href={`/settings/${user?.id}`} className='flex text-gray-500 w-full font-sans rounded-lg border-inherit px-2 py-2 hover:bg-[#3b49df] hover:bg-opacity-10 hover:text-[#3b49df] hover:underline'>
                          <button>
                              Settings
                        </button>
                      </Link>

                    <hr className='border-gray-300 flex-grow w-full'/>
                        <LogOutButton></LogOutButton>
                    
        </div>
      )}
    </div>
  );
}
