import React from 'react'
type ReactionProps = {
  reacted: Record<string, number>;
};
export default function Reaction({ reacted }: ReactionProps) {
  const totalReactedCount = Object.values(reacted).reduce((sum, count) => sum + count, 0);


  if (totalReactedCount > 0) {
    return (
      <img
        src="/heart-plus-active-9ea3b22f2bc311281db911d416166c5f430636e76b15cd5df6b3b841d830eefa.svg"
        alt="Reacted Heart"
        width="32"
        height="32"
      />
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" role="img" aria-hidden="true" >
    <g clip-path="url(#clip0_988_3276)">
        <path d="M19 14V17H22V19H18.999L19 22H17L16.999 19H14V17H17V14H19ZM20.243 4.75698C22.505 7.02498 22.583 10.637 20.479 12.992L19.059 11.574C20.39 10.05 20.32 7.65998 18.827 6.16998C17.324 4.67098 14.907 4.60698 13.337 6.01698L12.002 7.21498L10.666 6.01798C9.09103 4.60598 6.67503 4.66798 5.17203 6.17198C3.68203 7.66198 3.60703 10.047 4.98003 11.623L13.412 20.069L12 21.485L3.52003 12.993C1.41603 10.637 1.49503 7.01898 3.75603 4.75698C6.02103 2.49298 9.64403 2.41698 12 4.52898C14.349 2.41998 17.979 2.48998 20.242 4.75698H20.243Z" fill="#525252"></path>
    </g>
    <defs>
        <clipPath id="clip0_988_3276">
        <rect width="24" height="24" fill="white"></rect>
        </clipPath>
    </defs>
</svg>
  )
}
