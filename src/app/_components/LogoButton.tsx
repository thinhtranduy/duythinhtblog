import React from 'react'
import Image from 'next/image'
import  Link  from 'next/link'

const DevLogo = () => {
  return (
    <Link href='/home'>
      <div>
      {<Image src="/Deviologo.png" alt='logo' width={58} height={58}/>}
      </div>
    </Link>
  );
}

export default DevLogo