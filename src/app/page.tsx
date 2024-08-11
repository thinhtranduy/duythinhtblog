import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import LogOutButton from "./_components/LogOutButton";
import LogoButton from "./_components/LogoButton";
import Image from "next/image";

export default async function Home() {
 
  return(
    

    <main className="flex min-h-screen flex-col p-6">
      <div>
        <LogoButton/>
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">
          <p className={`text-xl text-gray-800 md:text-3xl md:leading-normal`}>
           Welcome to DevIO! Log in using the button below.
          </p>
          <Link
            href="/signIn"
          >
           <div className="flex justify-center">
            <button className=" w-[50%] h-full px-2 py-6 text-black rounded-lg bg-[#3b49df] hover:underline ">Log in </button>
           </div>
          </Link>

        </div>
        <div className="flex items-center justify-center p-6">
            <Image src="/HomePage.png" alt="Homepageimg" width={1000} height={700}/>
          </div>
      </div>
    </main>

);
}
