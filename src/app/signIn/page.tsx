"use client"
import React, { useState, useEffect } from 'react';
import { getProviders, signIn } from 'next-auth/react';
import type { ClientSafeProvider } from 'next-auth/react';
import DevLogo from '../_components/LogoButton';
import GoogleIcon from '../_components/IconFolder/GoogleIcon';
import AppleIcon from '../_components/IconFolder/AppleIcon';
import DiscordIcon from '../_components/IconFolder/DiscordIcon';
import { FaDiscord, FaGithub } from 'react-icons/fa6';
import GitHubIcon2 from '../_components/IconFolder/GiHubIcon2';
import GithubIcon from '../_components/IconFolder/GithubIcon';


const providerLogos: Record<string, React.ReactNode> = {
  Google: <GoogleIcon/>,
  Discord: <FaDiscord />,
  GitHub : <GitHubIcon2/>
};

export default function SignIn() {
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    async function loadProviders() {
      try {
        const res = await getProviders();
        setProviders(res);
      } catch (error) {
        console.error('Failed to load providers:', error);
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadProviders(); 
  }, []);

  return (
    <div className='bg-white h-screen'>
      <div className='flex justify-center items-center flex-col bg-inherit h-[50%] w-[35%] mx-auto rounded-lg bg-white'>
      <img src="/Deviologo.png" alt='logo' width={60} height={60}/>
      <h1 className="text-3xl font-bold mb-2 mt-5">Join the DEV Community</h1>
      <span className='text-md font-light text-gray-500 mb-4 text-center'>
        DEV Community is a community of 1,879,594 amazing developers
      </span>
      {providers &&
        Object.values(providers).map((provider: ClientSafeProvider) => {
            return (
              <div key={provider.name} className='w-full flex flex-col items-center text-lg'>
                <button
                  onClick={() => signIn(provider.id, { callbackUrl: '/home' })}
                  className="w-full px-6 py-2 mt-3 border border-gray-300 rounded-lg text-black bg-white hover:bg-gray-100 flex items-center"
                >
                  {providerLogos[provider.name] && (
                    <div className='mr-2  w-6 h-6'>{providerLogos[provider.name]}</div>
                  )}
                  <span className="flex-grow text-center text-sm ">Continue with {provider.name}</span>
                </button>
              </div>
            );
        })}
      <p className='flex justify-center text-center text-sm w-[50%] mt-6 italic'>
        By signing up, you are agreeing to our privacy policy, terms of use, and code of conduct.
      </p>
    </div>
    </div>
  );
}
