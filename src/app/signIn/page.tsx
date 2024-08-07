"use client"
import React, { useState, useEffect } from 'react';
import { getProviders, signIn } from 'next-auth/react';
import type { ClientSafeProvider } from 'next-auth/react';
import DevLogo from '../_components/LogoButton';

const providerLogos: Record<string, string> = {
  Google: '/googleLogo.svg',
  Discord: '/discordLogo.svg',
  // Add other providers and their icons here
};

export default function SignIn() {
  const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);

  useEffect(() => {
    async function loadProviders() {
      try {
        const res = await getProviders();
        setProviders(res);
      } catch (error) {
        console.error('Failed to load providers:', error);
        // Handle error, maybe set an error state or notify the user
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    loadProviders(); // Calling async function
  }, []);

  return (
    <div className='flex justify-center items-center flex-col bg-white h-[50%] w-[35%] my-32 mx-auto rounded-lg'>
      <DevLogo />
      <h1 className="text-4xl font-bold mb-2 mt-10">Join the DEV Community</h1>
      <span className='text-xl font-light text-black mb-4'>
        DEV Community is a community of 1,879,594 amazing developers
      </span>
      {providers &&
        Object.values(providers).map((provider: ClientSafeProvider) => {
            const logoSrc = providerLogos[provider.name];
            return (
            <div key={provider.name} className='w-full flex flex-col items-center'>
            <button
            onClick={() => signIn(provider.id, { callbackUrl: '/home' })}
            className="w-full px-2 mt-4 border-2 border-gray-200 rounded-lg text-black font-medium bg-white hover:bg-gray-200 flex items-center"
            >
            {logoSrc && <img src={logoSrc} alt={`${provider.name} logo`} className='w-12 h-12 bg-white mr-2' />}
            <span className="flex-grow text-center">Sign up with {provider.name}</span>
            </button>
            </div>
          );
        })}
        <p className='flex justify-center text-center w-[50%] mt-6 italic'>
            By signing up, you are agreeing to our privacy policy, terms of use and code of conduct.
        </p>
    </div>
  );
}
