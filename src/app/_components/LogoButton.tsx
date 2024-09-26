import React from 'react'
import Image from 'next/image'
import  Link  from 'next/link'

const DevLogo = () => {
  return (
    <Link href='/home'>
      <div>
      {<Image src="/Deviologo.png" alt='logo' width={48} height={48}/>}
      </div>
    </Link>
  );
}

export default DevLogo